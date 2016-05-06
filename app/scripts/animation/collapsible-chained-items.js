'use strict';

angular
    .module('portfolio')
    .animation('.collapsible-chained-items', function($log, $animateCss, MenuState)
    {
        // It seems silly, but there are cases where this DOESN'T load when
        // you think it does.
        $log.debug('.collapsible-chained-items', 'Loading animation...');

        var events = {};

        var AFTER_EXPAND_CLASS = 'after-expand',
            BEFORE_COLLAPSE_CLASS = 'before-collapse';

        var _expandElement = function(element)
        {
            element.removeClass(MenuState.actionExpand);

            var bottoms = element.data('bottoms'),
                heights = element.data('heights'),
                items = element.data('items'),
                animateFrom = {},
                animateTo = {};

            if (bottoms)
            {
                animateFrom.bottom = bottoms.collapsed;
                animateTo.bottom = bottoms.expanded;
            }

            if (heights)
            {
                animateFrom.height = heights.collapsed;
                animateTo.height = heights.expanded;
            }

            var options = {};

            // Following classes are applied:
            // ng-animate
            // collapsed-remove
            // collapsed-remove-active
            options.removeClass = MenuState.collapsedClassName;
            options.from = animateFrom;
            options.to = animateTo;

            if ( ! MenuState.isAnimated())
            {
                options.transitionStyle = 'none';
            }
            else
            {
                options.transitionStyle = element.css('transition');
            }

            return $animateCss(element, options)
            .start()
            .done(function()
            {
                var options = {};

                options.addClass = AFTER_EXPAND_CLASS;

                if ( ! MenuState.isAnimated())
                {
                    options.transitionStyle = 'none';
                }

                return $animateCss(element, options)
                .start()
                .done(function()
                {
                    element.removeClass(AFTER_EXPAND_CLASS);

                    var animator;

                    // Passing a collection of items doesn't work. We need
                    // one element per animation. If possible, it's best to
                    // pass a single parent wrapper for items.
                    for (var i = 0; i < items.length; i++)
                    {
                        var item = items.eq(i),
                            options = {};

                        options.removeClass = MenuState.collapsedClassName;
                        // options.stagger = 0.05;

                        if ( ! MenuState.isAnimated())
                        {
                            options.transitionStyle = 'none';
                        }
                        else
                        {
                            options.transitionStyle = item.css('transition');
                        }

                        animator = $animateCss(item, options).start();
                    }

                    MenuState.setAnimated(true);

                    // Return last item animator promise
                    return animator;
                });
            });
        };

        var _collapseElement = function(element)
        {
            element.removeClass(MenuState.actionCollapse);

            var bottoms = element.data('bottoms'),
                heights = element.data('heights'),
                items = element.data('items'),
                animateFrom = {},
                animateTo = {};

            if (bottoms)
            {
                animateFrom.bottom = bottoms.expanded;
                animateTo.bottom = bottoms.collapsed;
            }

            if (heights)
            {
                animateFrom.height = heights.expanded;
                animateTo.height = heights.collapsed;
            }

            $log.debug('.collapsible-chained-items', 'Is the menu state animated? %s', MenuState.isAnimated());

            var animator;

            // Passing a collection of items doesn't work. We need
            // one element per animation. If possible, it's best to
            // pass a single parent wrapper for items.
            for (var j = items.length - 1; j >= 0; j--)
            {
                var item = items.eq(j),
                    options = {};

                options.addClass = MenuState.collapsedClassName;
                // options.stagger = 0.05;

                if ( ! MenuState.isAnimated())
                {
                    options.transitionStyle = 'none';
                }

                animator = $animateCss(item, options).start();
            }

            // Attach chain to last item animator
            return animator.done(function()
            {
                var options = {};

                options.addClass = BEFORE_COLLAPSE_CLASS;

                if ( ! MenuState.isAnimated())
                {
                    options.transitionStyle = 'none';
                }

                return $animateCss(element, options)
                    .start()
                    .done(function()
                    {
                        element.removeClass(BEFORE_COLLAPSE_CLASS);

                        var options = {};

                        // Following classes are applied:
                        // ng-animate
                        // collapsed-add
                        // collapsed
                        // collapsed-add-active
                        options.addClass = MenuState.collapsedClassName;
                        options.from = animateFrom;
                        options.to = animateTo;

                        if ( ! MenuState.isAnimated())
                        {
                            options.transitionStyle = 'none';

                            // This still animates, albeit very quickly.
                            // options.duration = 0;

                            // Turn off a hard setting per request. Would be
                            // ideal to set this elsewhere.
                            MenuState.setAnimated(true);
                        }
                        else
                        {
                            options.transitionStyle = element.css('transition');
                        }

                        // $log.debug('.collapsible-chained-items', 'The animation options for the final collapse: %o', options);

                        return $animateCss(element, options).start();
                    });
            });
        };

        // Problem to be aware of: by the time this function is invoked, the
        // class in question has already been added. This function can't be
        // used to hook or chain with the className in question. For this reason,
        // we're using internal class names to signal behavior, and manually
        // adding external classes in the functions below.
        events.addClass = function(element, className, doneFn)
        {
            $log.debug('.collapsible-chained-items', 'Classes upon entering addClass: %s', element[0].className);

            switch (className)
            {
                // case MenuState.collapsedClassName: return _collapseElement(element, doneFn);
                case MenuState.actionCollapse: return _collapseElement(element, doneFn);
                case MenuState.actionExpand: return _expandElement(element, doneFn);
                default: return doneFn();
            }
        };

        events.removeClass = function(element, className, doneFn)
        {
            $log.debug('.collapsible-chained-items', 'Classes upon entering removeClass: %s', element[0].className);

            switch (className)
            {
                case MenuState.collapsedClassName: return _expandElement(element, doneFn);
                default: return doneFn();
            }
        };

        return events;
    });
