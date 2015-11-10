'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myLogo
 * @description
 * # myLogo
 */
angular
    .module('portfolio')
    .directive('myLogo', function ($window, $location, $routeParams)
    {
        return {
            restrict: 'E',
            controllerAs: 'logo',
            templateUrl: 'views/logo.html',
            controller: function($scope, $element)
            {
                var self = this;

                self.onRouteChange = function()
                {
                    if ( $routeParams.slug )
                    {
                        $element.hide();
                    }
                    else
                    {
                        $element.show();
                    }
                };

                // For now, don't do this. Might end up deleting this directive
                // later on.
                //$scope.$on('$routeChangeSuccess', self.onRouteChange);
            }
        };
    });
