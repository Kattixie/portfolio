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
    .directive('myContentMarker', function ($log, $timeout, MenuState)
    {
        var directiveDefinitionObject =
        {
            restrict: 'A',
            priority: 1,
            link: function(scope, iElement)
            {
                var self = {};

                self.init = function()
                {
                    // Without a timeout, we sometimes get an offset that is
                    // thousands of pixels off. All I can figure is that it's
                    // a result of a sub-view being in the process of loading.
                    // All attempts to detect when sub-views have finished
                    // have failed. Is there a better way?
                    $timeout(function()
                    {
                        MenuState.setContentPosition( iElement );

                        $log.debug('Setting content marker element.');

                    }, 300);
                };

                self.onDestroy = function()
                {
                    MenuState.removeContentPosition();
                };

                scope.$on('$destroy', self.onDestroy);

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
