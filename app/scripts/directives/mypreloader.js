'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myPreloader
 * @description
 * # myPreloader
 */
angular
    .module('portfolio')
    .directive('myPreloader', function ()
    {
        // Moving this bracket to the next line actually breaks this code in
        // Chrome (and possibly other browsers). Return returns undefined when
        // alone on a single line. More here:
        // http://stackoverflow.com/a/18800374
        return {

            restrict: 'A',
            link: function(scope, element)
            {
                var loadingElement,
                    spinnerElement;

                scope.$watch('ngSrc', function()
                {
                    // Add spinner and hide element.

                    element.addClass('loading');

                    spinnerElement = angular.element('<div>').addClass('spinner');

                    loadingElement = angular.element('<div>')
                                        .addClass('loader')
                                        .append( spinnerElement );

                    element
                        .parent()
                        .prepend( loadingElement );
                });

                element.on('load', function()
                {
                    // Remove spinner and show element.

                    element
                        .removeClass('loading')
                        .addClass('complete');

                    loadingElement
                        .addClass('complete');
                });

                scope.$on('$destroy', function()
                {
                    element.off('load');
                });
            }
        };
    });
