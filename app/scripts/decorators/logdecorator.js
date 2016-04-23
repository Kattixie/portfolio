'use strict';

angular
    .module('portfolio')
    .config(function($provide, $logProvider, config)
    {
        var _enabledNamespaces;

        $logProvider.debugEnabled( config.DEBUG );

        if (config.DEBUG_NAMESPACE_MODE)
        {
            if (angular.isArray(config.DEBUG_NAMESPACES))
            {
                _enabledNamespaces = config.DEBUG_NAMESPACES;
            }

            _enabledNamespaces.sort();

            // This is the really important part.
            $provide.decorator('$log', function($delegate)
            {
                // Save original, it will behave as a sort of base method here.
                var debugFn = $delegate.debug;

                $delegate.debug = function()
                {
                    // This is voodoo magic. Make arguments behave like an array.
                    var args = [].slice.call(arguments),
                        namespace = args[0],
                        newArgs = args.slice(1);

                    newArgs[0] = namespace + ': ' + newArgs[0];

                    if ( _inEnabledNamespaces(namespace) )
                    {
                        debugFn.apply(null, newArgs);
                    }
                };

                return $delegate;
            });
        }

        var _inEnabledNamespaces = function(target)
        {
            // If the namespaces array is empty, consider all spaces valid.
            if ( ! angular.isArray(_enabledNamespaces) || _enabledNamespaces.length === 0)
            {
                return true;
            }

            var min = 0,
                max = _enabledNamespaces.length - 1;

            while ( min <= max )
            {
                var mid = Math.floor( (min + max) / 2);

                if (_enabledNamespaces[mid] < target)
                {
                    min = mid + 1;
                }
                else if (_enabledNamespaces[mid] > target)
                {
                    max = mid - 1;
                }
                else
                {
                    return true;
                }
            }

            return false;
        };
    });
