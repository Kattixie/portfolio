'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myRatioVideo
 * @description
 * # myRatioVideo
 * Creating another directive because special functionality might be required
 * with this element in the future.
 */
angular
    .module('portfolio')
    .directive('myRatioVideo', function ($log, myRatioDirective)
    {
        var base = myRatioDirective[0];

        var directiveDefinitionObject =
        {
            restrict: 'E',
            scope:
            {
                fullSize: '=',
                height: '=',
                path: '=',
                width: '='
            },
            template: function()
            {
                var baseTemplate = base.template();

                var subTemplate = '<iframe ng-src="{{::path}}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen my-preloader></iframe>';
                //var subTemplate = '<iframe ng-src="' + tAttrs.path + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen my-preloader></iframe>';

                var template = baseTemplate.replace('<ng-transclude></ng-transclude>', subTemplate);

                return template;
            },
            link: function(scope, iElement, iAttrs)
            {
                base.link(scope, iElement, iAttrs);

                iElement
                    .find('iframe')
                    .css({
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: '100%'
                    });
            }
        };

        return directiveDefinitionObject;
    });
