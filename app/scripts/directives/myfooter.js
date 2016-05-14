'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myFooter
 * @description
 * # myFooter
 */
angular
    .module('portfolio')
    .directive('myFooter', function ($log, LoadState, PageState)
    {
        return {
            restrict: 'E',
            transclude: true,
            template: function()
            {
                var template = '<ng-transclude></ng-transclude>';

                return template;
            },
            controllerAs: 'footer',
            bindToController: true,
            controller: function($scope, $element)
            {
                var ctrl = this;

                angular.extend(ctrl,
                {
                    loadingStateClassName: LoadState.loadingClassName
                });

                ctrl.getLoadingStateClassName = function()
                {
                    // $log.debug('myFooter', 'Is the page loading? %s', PageState.isLoading());

                    if (PageState.isLoading())
                    {
                        ctrl.loadingStateClassName = LoadState.loadingClassName;
                    }
                    else
                    {
                        ctrl.loadingStateClassName = LoadState.completeClassName;
                    }

                    return ctrl.loadingStateClassName;
                };
            }
        }
    });
