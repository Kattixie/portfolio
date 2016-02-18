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
    .factory('WindowState', function( $log, $window, $timeout )
    {
        var service =
        {
            // jQuery or jqLite window object.
            jqWindow: angular.element( $window ),

            defaultDelay:       500,
            resizeEventPrefix:  'resize',
            scrollEventPrefix:  'scroll'
        };

        var _timeouts = [];

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

        return service;
    });
