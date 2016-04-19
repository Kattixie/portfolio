'use strict';

/**
 * @ngdoc service
 * @name portfolio.MenuState
 * @description
 * # MenuState
 * Service that maintains information about menu state, which is helpful in
 * cases where we don't want to worry about controller and directive
 * relationships (parent vs. child, siblings, etc).
 */
angular
    .module('portfolio')
    .factory('MenuState', function ($log, $animate, WindowState)
    {
        var service =
        {
            selectedGalleryMode:    null,

            collapsedClassName:     'collapsed',
            collapsedHardClassName: 'collapsed-hard',
            compactClassName:       'compact',
            activeClassName:        'active',
            centerClassName:        'centered',
            scrollableClassName:    'scrollable'
        };

        var _isCompact = false,
            _isCollapsed = false,
            _isCentered = false,
            _isHard = false,
            _isScrollbarPadded = false;

        var _icon;

        var _currContentElement;

        var _contentPositionY;

        var _collapsibleElements = [];

        var _compactibleElements = [];

        var _centerableElements = [];

        var _scrollbarPaddedElements = [];

        var _prevURI,
            _nextURI;

        service.isCompacted = function()
        {
            return _isCompact;
        };

        service.isCollapsed = function()
        {
            return _isCollapsed;
        };

        service.isCentered = function()
        {
            return _isCentered;
        };

        service.setIcon = function( element )
        {
            _icon = element;
        };

        service.getIconHeight = function()
        {
            return _icon.outerHeight();
        };

        service.addCollapsibleElement = function( element )
        {
            _collapsibleElements.push(element);
        };

        service.addCompactibleElement = function( element )
        {
            // $log.debug('MenuState', 'Adding a compactible element.');

            _compactibleElements.push(element);
        };

        service.addCenterableElement = function( element )
        {
            _centerableElements.push(element);
        };

        service.addScrollbarPaddedElement = function( element )
        {
            _scrollbarPaddedElements.push(element);
        };

        service.setCompacted = function( isCompact )
        {
            var switchedState = ( _isCompact !== isCompact );

            // $log.debug('MenuState', 'Comparing passed compact state to set compact state: %s vs. %s', isCompact, _isCompact);

            if ( ! switchedState )
            {
                // $log.debug('MenuState', 'The compact state has not changed.');

                return switchedState;
            }

            // $log.debug('MenuState', 'Changing compact state to: %s', isCompact);

            _isCompact = isCompact;

            // $log.debug('MenuState', 'The number of compactible elements: %s', _compactibleElements.length);

            for (var i = 0; i < _compactibleElements.length; i++)
            {
                if ( _isCompact)
                {
                    // Adds following classes in order:
                    // ng-animate
                    // [service.compactClassName]-add
                    // [service.compactClassName]
                    // [service.compactClassName]-add-active
                    $animate.addClass(_compactibleElements[i], service.compactClassName);

                    /*
                    if ( ! _compactibleElements[i].hasClass(service.compactClassName) )
                    {
                        _compactibleElements[i].addClass(service.compactClassName);
                    } */
                }
                else
                {
                    // Adds following classes in order:
                    // ng-animate
                    // [service.compactClassName]-remove
                    // [service.compactClassName]-remove-active
                    $animate.removeClass(_compactibleElements[i], service.compactClassName);

                    /*
                    if ( _compactibleElements[i].hasClass(service.compactClassName))
                    {
                        _compactibleElements[i].removeClass(service.compactClassName);
                    }
                    */
                }
            }

            return switchedState;
        };

        service.setCollapsed = function( isCollapsed )
        {
            var switchedState = ( _isCollapsed !== isCollapsed );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isCollapsed = isCollapsed;

            for (var i = 0; i < _collapsibleElements.length; i++)
            {
                var element = _collapsibleElements[i];

                if ( _isCollapsed )
                {
                    if ( _isHard )
                    {
                        $log.debug('MenuState', 'The menu hardness is true, so a special class will be added.');

                        element.addClass(service.collapsedHardClassName);
                    }

                    $animate
                        .addClass(element, service.collapsedClassName)
                        .then( function()
                        {
                            element.removeClass(service.collapsedHardClassName);
                        });
                    // element.addClass(service.collapsedClassName);
                }
                else
                {
                    $animate.removeClass(element, service.collapsedClassName);
                    // _collapsibleElements[i].removeClass(service.collapsedClassName);
                }
            }

            return switchedState;
        };

        service.setCentered = function( isCentered )
        {
            var switchedState = ( _isCentered !== isCentered );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isCentered = isCentered;

            for (var i = 0; i < _centerableElements.length; i++)
            {
                if ( _isCentered )
                {
                    if ( ! _centerableElements[i].hasClass(service.centerClassName) )
                    {
                        _centerableElements[i].addClass(service.centerClassName);
                    }
                }
                else
                {
                    _centerableElements[i].removeClass(service.centerClassName);
                }
            }

            return switchedState;
        };

        service.setScrollbarPadded = function( isScrollbarPadded )
        {
            var switchedState = ( _isScrollbarPadded !== isScrollbarPadded );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isScrollbarPadded = isScrollbarPadded;

            for (var i = 0; i < _scrollbarPaddedElements.length; i++)
            {
                // We currently make a guess about which right property
                // needs to be adjusted from the position. This may need to be
                // changed to allow more control.
                var position = _scrollbarPaddedElements[i].css('position');

                if ( _isScrollbarPadded )
                {
                    if (position === 'absolute' || position === 'fixed')
                    {
                        _scrollbarPaddedElements[i].css('right', WindowState.getScrollbarWidth() );
                    }
                    else
                    {
                        _scrollbarPaddedElements[i].css('padding-right', WindowState.getScrollbarWidth() );
                    }
                }
                else
                {
                    if (position === 'absolute' || position === 'fixed')
                    {
                        _scrollbarPaddedElements[i].css('right', '');
                    }
                    else
                    {
                        _scrollbarPaddedElements[i].css('padding-right', '');
                    }
                }
            }

            return switchedState;
        };

        // Intended to allow some control over how much animation is allowed.
        // If true, we want minimal animation for state change and will add
        // a special class for CSS animation purposes.
        service.setHard = function( isHard )
        {
            var switchedState = ( _isHard !== isHard );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isHard = isHard;

            return switchedState;
        };

        service.resetContentPosition = function()
        {
            _currContentElement = undefined;

            _contentPositionY = undefined;
        };

        service.setContentPosition = function( element, entrancePoint )
        {
            if ( element )
            {
                _currContentElement = element;
            }

            if ( _currContentElement )
            {
                // We want the final position, not any positions associated with
                // animation states.
                if ( element.hasClass('ng-animate') )
                {
                    $log.debug('MenuState', 'The content position could not be determined due to the element currently animating.');

                    return false;
                }

                _contentPositionY = _currContentElement.offset().top;
            }

            $log.debug('MenuState', 'The content position, determined before offset is appied: %s', _contentPositionY);

            if ( entrancePoint )
            {
                $log.debug('MenuState', 'Applying a content position entrance point offset... %s', _currContentElement.height() * entrancePoint);

                _contentPositionY = _contentPositionY + _currContentElement.height() * entrancePoint;
            }

            $log.debug('MenuState', 'The content position: %s', _contentPositionY);

            return _contentPositionY;
        };

        service.getContentPosition = function()
        {
            // service.setContentPosition();

            return _contentPositionY;
        };

        service.removeContentPosition = function()
        {
            _currContentElement = undefined;
            _contentPositionY = undefined;
        };

        service.isCollapsible = function()
        {
            return ( _icon.filter(':visible').length > 0 ) ? true : false;
        };

        service.setPrevURI = function(uri)
        {
            _prevURI = uri;
        };

        service.setNextURI = function(uri)
        {
            _nextURI = uri;
        };

        service.prevExists = function()
        {
            if (_prevURI)
            {
                return true;
            }

            return false;
        };

        service.nextExists = function()
        {
            if (_nextURI)
            {
                return true;
            }

            return false;
        };

        service.getPrevURI = function()
        {
            return _prevURI;
        };

        service.getNextURI = function()
        {
            return _nextURI;
        };

        // Public API
        return service;
    });
