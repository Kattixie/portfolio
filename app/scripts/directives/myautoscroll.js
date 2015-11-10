'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myAutoscroll
 * @description
 * # myAutoscroll
 */
angular
    .module('portfolio')
    .directive('myAutoscroll', function ($log, $anchorScroll)
    {
        return {
            restrict: 'A',
            link: function(scope)
            {
                scope.$on('$routeChangeStart', function()
                {
                    $anchorScroll();
                });
            }
        };
    });
