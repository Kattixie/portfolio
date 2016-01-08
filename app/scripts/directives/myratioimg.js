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
    .directive('myRatioImg', function ($log, $window)
    {
        var directiveDefinitionObject =
        {
            restrict: 'E',
            /* This results in template variables from the parent not being
               compiled at a time when they are accessible.
            scope:
            {
                ngSrcPath: '@',
                mySrcPath: '@'
            },
            */
            template: function(tElement, tAttrs)
            {
                var template = '<div class="media">';

                // Not using a psuedo-element to create the padding that
                // represents the ratio because it's a mess to work with
                // dynamically.
                template += '<div class="ratio"></div>';

                if ( tAttrs.useNgSrc === 'true' )
                {
                    template += '<img ng-src="' + tAttrs.path + '">';
                }
                else
                {
                    template += '<img my-src="' + tAttrs.path + '">';
                }

                template += '</div>';

                return template;
            },
            link: function(scope, iElement, iAttrs)
            {
                var self = {};

                self.eWindow = angular.element( $window );
                self.element = iElement;

                var width = ( iAttrs.fullSize === 'true' ) ? '100%' : iAttrs.width;

                var ratio = iAttrs.height / iAttrs.width * 100;

                self.init = function()
                {
                    self.setElementStyles();
                };

                self.setElementStyles = function()
                {
                    iElement.width( width );

                    // These styles are set here because they are necessary in
                    // this precise manner for the ratio to work. Further, a
                    // CSS pre-compiler mixin makes less sense when dynamic data
                    // is involved as part of the calculation.
                    if ( iAttrs.height && iAttrs.width )
                    {
                        iElement
                            .find('.media')
                            .css(
                            {
                                position: 'relative',
                                top: 0,
                                left: 0,
                                width: width,
                                maxWidth: iAttrs.width
                            });

                        iElement
                            .find('.ratio')
                            .css(
                            {
                                paddingTop: ratio + '%',
                                position: 'relative',
                                    top: 0,
                                    left: 0
                            });

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

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
