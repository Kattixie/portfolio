'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myRatioImg
 * @description
 * # myRatioImg
 * This fairly basic directive exists to simplify use of images that above all
 * need to maintain a particular aspect ratio. Since there is not a great way to
 * achieve this without wrapper elements, hopefully this reduces confusion and
 * at least guarantees consistent implementation throughout a project.
 */
angular
    .module('portfolio')
    .directive('myRatioImg', function ($log)
    {
        var directiveDefinitionObject =
        {
            restrict: 'E',
            scope:
            {
                fullSize: '@',
                height: '@',
                path: '@',
                useNgSrc: '@',
                width: '@'
            },
            template: function(tElement, tAttrs)
            {
                //var template = '<my-ratio height="{{height}}" width="{{width}}" full-size="{{fullSize}}">';
                var template = '<my-ratio>';

                if ( tAttrs.useNgSrc === 'true' )
                {
                    // template += '<img ng-src="' + tAttrs.path + '">';
                    template += '<img ng-src="{{path}}">';
                }
                else
                {
                    // template += '<img my-src="' + tAttrs.path + '">';
                    template += '<img my-src="{{path}}">';
                }

                template += '</my-ratio>';

                return template;
            },
            link: function(scope, iElement, iAttrs, ratioCtrl)
            {
                var self = {};

                // $log.debug('The ratio as set in myRatio directive: %s', scope.ratio);

                self.element = iElement;

                // Width and height of 100% are specified because there
                // may be cases where the image is being blown up if the
                // data specifies. (Example: animated GIFs)
                iElement
                    .find('img')
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
