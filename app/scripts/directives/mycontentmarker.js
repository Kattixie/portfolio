'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myContentMarker
 * @description
 * # myContentMarker
 * Interacts with MenuState service to determine where content begins on a view.
 * Hopefully this enables better menu behavior in the long-run.
 */
angular
    .module('portfolio')
    .directive('myContentMarker', function ($log, $timeout, MenuState, attributes)
    {
        var directiveDefinitionObject =
        {
            restrict: 'A',
            priority: 1,
            link: function(scope, iElement, iAttrs)
            {
                var vm = {};

                vm.init = function()
                {
                    // Without a timeout, we sometimes get an offset that is
                    // thousands of pixels off. All I can figure is that it's
                    // a result of a sub-view being in the process of loading.
                    // All attempts to detect when sub-views have finished
                    // have failed. Is there a better way? Possibly also related
                    // to CSS animation fade-in for view?
                    $timeout(function()
                    {
                        vm.setElement();

                    }, 300, false);
                };

                vm.setElement = function()
                {
                    if (iAttrs.startAt === attributes.FIRST)
                    {
                        $log.debug('myContentMarker', 'Choosing the first child.');

                        iElement = iElement.children().eq(0);
                    }
                    else if (iAttrs.startAt === attributes.MID)
                    {
                        var children = iElement.children();

                        $log.debug('myContentMarker', 'The number of children: %s', children.length);

                        $log.debug('myContentMarker', 'Choosing the mid child at index [%s].', Math.floor(children.length / 2));

                        iElement = children.eq( Math.floor(children.length / 2) );
                    }

                    MenuState.setContentPosition( iElement, iAttrs.entrancePoint );
                };

                vm.onDestroy = function()
                {
                    MenuState.removeContentPosition();
                };

                scope.$on('$destroy', vm.onDestroy);

                vm.init();
            }
        };

        return directiveDefinitionObject;
    });
