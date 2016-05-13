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
            link: function(scope, element, attrs)
            {
                scope.$watch(attrs.ngBindHtml, function()
                {
                    var boundElement;

                    if ( element.is('a') )
                    {
                        boundElement = element;
                    }
                    else
                    {
                        boundElement = element.find('a');
                    }

                    boundElement
                        .filter( function()
                        {
                            return this.hostname && this.hostname !== window.location.hostname;
                        })
                        .addClass('external')
                        .attr('target', '_blank');
                });
            }
        };
    });
