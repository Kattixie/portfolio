function LogDecorator($provide, $logProvider, config)
{
    var fn = this,
        enabledNamespaces;

    this.init = function()
    {
        $logProvider.debugEnabled( config.DEBUG );

        if (angular.isArray( config.DEBUG_NAMESPACES) )
        {
            enabledNamespaces = config.DEBUG_NAMESPACES;

            enabledNamespaces.sort();
        }

        this.decorate();
    };

    this.decorate = function()
    {
        if ( config.DEBUG_NAMESPACE_MODE )
        {
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

                    if ( fn.inEnabledNamespaces(namespace) )
                    {
                        debugFn.apply(null, newArgs);
                    }
                };

                return $delegate;

            });
        }
    };

    this.inEnabledNamespaces = function(target)
    {
        // If the namespaces array is empty, consider all spaces valid.
        if ( ! angular.isArray(enabledNamespaces) || enabledNamespaces.length === 0)
        {
            return true;
        }

        var min = 0,
            max = enabledNamespaces.length - 1;

        while ( min <= max )
        {
            var mid = Math.floor( (min + max) / 2);

            if (enabledNamespaces[mid] < target)
            {
                min = mid + 1;
            }
            else if (enabledNamespaces[mid] > target)
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

    this.init();
};
