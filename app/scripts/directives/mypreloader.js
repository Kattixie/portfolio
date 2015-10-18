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
                var loadingElement;

                scope.$watch('ngSrc', function()
                {
                    // Add spinner and hide element.

                    element.addClass('loading');

                    loadingElement = angular.element('<div>')
                                        .addClass('loader')
                                        .css(
                                        {
                                            height: element.height(), // Only available with jQuery
                                            width: element.width(), // Only available with jQuery
                                        });

                    element
                        .parent()
                        .prepend( loadingElement );
                });

                element.on('load', function()
                {
                    // Remove spinner and show element.

                    element.removeClass('loading');

                    loadingElement.addClass('complete');
                });

                scope.$on('$destroy', function()
                {
                    element.off('load');
                });
            }
        };
    });
