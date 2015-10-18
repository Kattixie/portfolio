'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myExternalLinks
 * @description
 * # myExternalLinks
 */
angular
    .module('portfolio')
    .directive('myExternalLinks', function ()
    {
        return {
            restrict: 'A',
            // priority: 10, // Turns out this is not necessary.
            link: function(scope, element, attrs)
            {
                scope.$watch(attrs.ngBindHtml, function()
                {
                    element
                        .find('a')
                        .filter( function()
                        {
                            return this.hostname && this.hostname !== window.location.hostname;
                        })
                        .addClass('external')
                        .attr('target', '_blank')
                        .wrapInner('<span>');
                });
            }
        };
    });
