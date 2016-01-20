'use strict';

/**
 * @ngdoc service
 * @name portfolio.Keyboard
 * @description
 * # Keyboard
 * Service that handles global keyboard events. Idea borrowed from:
 * http://stackoverflow.com/a/25832603
 */
angular
    .module('portfolio')
    .factory('Keyboard', function ($document, $timeout, keyCodes)
    {
        var service = {};

        // Dictionary of keyCodes => objects with callback property
        var _keyHandlers = {};

        service.on = function(keyName, callback)
        {
            var keyCode = keyCodes[keyName];

            if (keyCode)
            {
                _keyHandlers[keyCode] = { callback: callback };
            }
        };

        // Services are singletons
        $document.on('keydown', function(even)
        {
            var keyDown = _keyHandlers[ event.keyCode ];

            if (keyDown)
            {
                event.preventDefault();

                // Timeout is being used to trigger a digest. $rootScope could
                // alternatively be used.
                $timeout( function()
                {
                    keyDown.callback();
                });
            }
        });

        // Public API
        return service;
    });
