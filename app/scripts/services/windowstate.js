'use strict';

/**
 * @ngdoc service
 * @name portfolio.WindowState
 * @description
 * # WindowState
 * Setting up with potential for future use. Also houses single instance of
 * jqLite/jQuery window object, which it turns out gets a lot of use.
 */
angular
    .module('portfolio')
    .factory('WindowState', function( $log, $window, $document, $timeout )
    {
        var service =
        {
            // jQuery or jqLite window object.
            jqWindow: angular.element( $window ),
            docBody: angular.element('body'),

            defaultDelay:       500,
            resizeEventPrefix:  'resize',
            scrollEventPrefix:  'scroll',

            SCROLL_UP:          'up',
            SCROLL_DOWN:        'down'
        };

        var _timeouts = [],
            _prevDir,
            _currDir,
            _prevPageYOffset,
            _scrollEnabled = true,
            _scrollBarWidth,
            _bodyScrollContextTO;

        // Private Methods

        var _generateTimeoutId = function()
        {
            return _timeouts.length;
        };

        var _addTimeout = function(timeout, id)
        {
            // Notice potential to accidentally overwrite existing timeouts.
            _timeouts[id] = timeout;

            //$log.debug('Added timeout: %s', id);
            // $log.debug('The timeout object at add: %o', _timeouts);
        };

        var _removeTimeoutById = function(id)
        {
            if ( _timeouts[id] )
            {
                $timeout.cancel( _timeouts[id] );

                _timeouts[id] = undefined;

                // $log.debug('The timeouts after removal: %o', _timeouts);
            }
        };

        var _onEvent = function( callback, event, delay )
        {
            // Setting timer at this level should result in individual timers
            // relative to each time this wrapper function is invoked.
            var localTO,
                timeoutId = _generateTimeoutId();

            _addTimeout(localTO, timeoutId);

            // $log.debug('The event [%s] timeout id: %s', event, timeoutId);

            if ( ! delay )
            {
                service.jqWindow.on(event, callback);
            }
            else
            {
                service.jqWindow.on(event, function()
                {
                    if (localTO)
                    {
                        _removeTimeoutById( timeoutId );
                    }

                    localTO = $timeout( function()
                    {
                        callback();

                        _removeTimeoutById( timeoutId );

                    }, delay);

                    _addTimeout(localTO, timeoutId);
                });
            }

            // So that the directive requesting this functionality has some
            // way to refer to the timer that was created.
            return timeoutId;
        };

        var _destroyEvent = function(timeoutId, event)
        {
            $log.debug('WindowState', 'The event is being removed from the window: %o', event);

            service.jqWindow.off(event);

            _removeTimeoutById(timeoutId);
        };

        // Public Methods

        service.onResize = function( callback, namespace, delay )
        {
            var event = service.resizeEventPrefix;

            if (namespace)
            {
                event += '.' + namespace;
            }

            return _onEvent( callback, event, delay );
        };

        service.onScroll = function( callback, namespace, delay )
        {
            var event = service.scrollEventPrefix;

            if (namespace)
            {
                event += '.' + namespace;
            }

            return _onEvent( callback, event, delay );
        };

        service.destroyResize = function(timeoutId, namespace)
        {
            var event = service.resizeEventPrefix;

            if (namespace)
            {
                event += '.' + namespace;
            }

            _destroyEvent(timeoutId, event);
        };

        service.destroyScroll = function(timeoutId, namespace)
        {
            var event = service.scrollEventPrefix;

            if (namespace)
            {
                event += '.' + namespace;
            }

            _destroyEvent(timeoutId, event);
        };

        /* SCROLL POSITION */

        // Returns pixels scrolled from top.
        service.getPixelsScrolledY = function()
        {
            return $window.pageYOffset;
        };

        service.getViewportTopPosition = function()
        {
            return service.getPixelsScrolledY();
        };

        service.getViewportBottomPosition = function()
        {
            return service.getPixelsScrolledY() + service.jqWindow.height();
        };

        service.getHeight = function()
        {
            return service.jqWindow.height();
        };

        service.isAtTop = function()
        {
            return service.getPixelsScrolledY() === 0;
        };

        service.scrollDirectionHasChanged = function()
        {
            return _prevDir !== service.getScrollDirection();
        };

        service.getScrollDirection = function()
        {
            var currPageYOffset = $window.pageYOffset,
                dir;

            // Return stored direction if the offsets are the same.
            // This can happen if this function is called numerous times on
            // one scroll event.
            if ( _currDir && currPageYOffset === _prevPageYOffset )
            {
                // $log.debug('WindowState', 'No need to update current direction.');

                return _currDir;
            }

            // $log.debug('WindowState', 'Comparing current position [%s] to prev position [%s]', currPageYOffset, _prevPageYOffset);

            if ( _prevPageYOffset === undefined || currPageYOffset > _prevPageYOffset )
            {
                dir = service.SCROLL_DOWN;
            }
            else
            {
                dir = service.SCROLL_UP;
            }

            _prevPageYOffset = currPageYOffset;

            // Assign previous direction so we can detect changes in direction.
            _prevDir = _currDir;

            // Assign what we've determined is the current direction.
            _currDir = dir;

            return dir;
        };

        service.applyWindowOffsetTo = function( positionY, windowOffset, offsetDir )
        {
            if ( windowOffset )
            {
                if ( ! offsetDir )
                {
                    offsetDir = -1;
                }

                var height = service.jqWindow.height();

                var oldPosition = positionY;

                positionY = positionY + offsetDir * height * windowOffset;

                if ( positionY < 0 )
                {
                    positionY = 0;
                }

                $log.debug('WindowState', 'The offset has been applied: %s --> %s', oldPosition, positionY);
            }

            return positionY;
        };

        /**
         * Determines if the position has been scrolled to from the top of the
         * document.
         */
        service.hasScrolledTo = function( pixelsY, windowOffset )
        {
            pixelsY = service.applyWindowOffsetTo( pixelsY, windowOffset );

            // $log.debug('WindowState', 'The position compared to the pixels scrolled: %s vs. %s', pixelsY, service.getPixelsScrolledY());

            return pixelsY <= service.getPixelsScrolledY();
        };

        /**
         * Determines if the position has entered the viewport from an
         * a horizon that corresponds with the scroll direction.
         * @param positionY - The vertical position in question.
         * @param dir - The scroll direction. This is important because we need
         *  to know if we're looking for the position from the top or bottom of
         *  the window. If no direction is provided, the most recent scroll
         *  direction is used.
         * @param windowOffset - A positive or negative percentage of the
         *  viewport to apply as an offset. A value of -1.00, for instance,
         *  would trigger a "true" response if scrolling down once the position
         *  is at the top of the viewport (position - 100% of the window).
         */
        service.hasEnteredViewport = function( positionY, dir, windowOffset )
        {
            if ( ! dir )
            {
                dir = service.getScrollDirection();
            }

            var horizon;

            positionY = service.applyWindowOffsetTo( positionY, windowOffset );

            if ( dir === service.SCROLL_DOWN )
            {
                horizon = service.getViewportBottomPosition();

                if ( positionY <= horizon )
                {
                    return true;
                }

                return false;
            }
            else
            {
                horizon = service.getViewportTopPosition();

                if ( positionY >= horizon )
                {
                    return true;
                }

                return false;
            }
        };

        service.hasEnteredViewportFromBottom = function( positionY, windowOffset )
        {
            return service.hasEnteredViewport( positionY, service.SCROLL_DOWN, windowOffset );
        };

        service.hasEnteredViewportFromTop = function( positionY, windowOffset )
        {
            return service.hasEnteredViewport( positionY, service.SCROLL_UP, windowOffset );
        };

        /**
         * Determines if element is in view.
         * @param elementScrollProps - Element props to test position with.
         *  Expected properties are top, height, and bottom.
         * @param topPercentOffset - Percentage of element that needs to be in
         *  view (scrolling down).
         * @param bottomPercentOffset - Percentage of element that needs to be
         *  in view (scrolling up).
         */
        service.inView = function( props, topPercentOffset, bottomPercentOffset )
        {
            if ( ! topPercentOffset )
            {
                topPercentOffset = 0;
            }

            if ( ! bottomPercentOffset )
            {
                bottomPercentOffset = 0;
            }

            var dir = service.getScrollDirection(),
                maxBoundary = $document.height(),
                elementVitalBoundary,
                viewportTopY = service.getViewportTopPosition(),
                viewportBottomY = service.getViewportBottomPosition();

            if ( dir === service.SCROLL_DOWN )
            {
                // $log.debug('WindowState', 'Scrolling down, percentage of element that must be in viewport: %s', topPercentOffset * 100 + '%');

                // We are scrolling down, and the boundary is some percentage
                // from the top of the element.
                elementVitalBoundary = props.top + props.height * topPercentOffset;
            }
            else
            {
                // $log.debug('WindowState', 'Scrolling up, percentage of element that must be in viewport: %s', bottomPercentOffset * 100 + '%');

                // We are scrolling up, and the boundary is some percentage
                // from the bottom of the element.
                elementVitalBoundary = props.bottom - props.height * bottomPercentOffset;
            }

            // In edge cases, we can end up with a boundary that is outside the
            // range of the document. Enforce lower and upper limits here.
            if ( elementVitalBoundary < 0 )
            {
                elementVitalBoundary = 0;
            }

            if ( elementVitalBoundary > maxBoundary)
            {
                elementVitalBoundary = maxBoundary;
            }

            // $log.debug('WindowState', 'The element top [%s] and bottom [%s]', props.top, props.bottom);
            // $log.debug('WindowState', 'The vital element boundary: %s', elementVitalBoundary);

            // Test if the boundary is above or below the appropriate viewport
            // horizon depending on scroll direction if in back-tracking mode.
            // Back-tracking mode is most likely being used because the element
            // is already in view. We still test here to help us figure out
            // when we can turn back-tracking mode off.
            if ( props.backTrackingMode )
            {
                if ( dir === service.SCROLL_DOWN )
                {
                    if ( elementVitalBoundary > viewportTopY )
                    {
                        return true;
                    }
                }
                else
                {
                    if ( elementVitalBoundary < viewportBottomY )
                    {
                        return true;
                    }
                }
            }

            // $log.debug('WindowState', 'The viewport top [%s] and bottom [%s]', viewportTopY, viewportBottomY);

            // Test if the boundary is within the viewport region. We are
            // unaware of direction here. Note inclusive range at both endpoints.
            if (elementVitalBoundary >= viewportTopY && elementVitalBoundary <= viewportBottomY )
            {
                $log.debug('WindowState', 'The element boundary is in range: %s <= %s <= %s.',
                    viewportTopY,
                    elementVitalBoundary,
                    viewportBottomY);

                return true;
            }

            return false;
        };

        /* SCROLL PROPERTIES */

        service.getScrollbarWidth = function()
        {
            // Use cached value if one exists.
            if ( _scrollBarWidth )
            {
                return _scrollBarWidth;
            }

            var scrollDiv = angular.element('<div>');

            scrollDiv.css(
            {
                height: 100,
                msOverflowStyle: 'scrollbar', // Needed?
                overflow: 'scroll',
                position: 'absolute',
                width: 100
            })
            .appendTo ( service.docBody );

            _scrollBarWidth = scrollDiv.width() - scrollDiv[0].clientWidth;

            scrollDiv.remove();

            $log.debug('WindowState', 'The scrollbar width is: %s', _scrollBarWidth);

            return _scrollBarWidth;
        };

        /* SCROLL BEHAVIOR */

        service.disableScrollbar = function()
        {
            service.docBody.css(
            {
                position: 'fixed',
                overflowY: 'scroll',
                width: '100%'
            });

            _scrollEnabled = false;
        };

        service.enableScrollbar = function()
        {
            if ( ! _scrollEnabled )
            {
                service.docBody.css(
                {
                    position: '',
                    overflowY: '',
                    width: ''
                });

                _scrollEnabled = true;
            }
        };

        service.hideScrollbar = function()
        {
            service.docBody.css(
            {
                // height: '100%'
                overflow: 'hidden',
                marginRight: service.getScrollbarWidth()
            });

            _scrollEnabled = false;
        };

        service.showScrollbar = function()
        {
            if ( ! _scrollEnabled )
            {
                service.docBody.css(
                {
                    height: '',
                    overflow: '',
                    marginRight: ''
                });

                _scrollEnabled = true;
            }
        };

        // This needs work. Overall I don't know if it's a good idea. The body
        // needs to be manipulated in a way that its scrollable height matches
        // the scrollable height of the passed element.
        service.setBodyScrollContextTo = function( element )
        {

            _bodyScrollContextTO = service.onScroll(function(e)
            {
                $log.debug('WindowState', 'The body has been scrolled.');
                
                e.preventDefault();

                // element.scrollTop( service.getPixelsScrolledY() );

            }, 'context');
        };

        service.resetBodyScrollContext = function()
        {
            service.destroyScroll( _bodyScrollContextTO, 'context');
        };

        return service;
    });
