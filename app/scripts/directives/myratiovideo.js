'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myRatioVideo
 * @description
 * # myRatioVideo
 * Creating another directive because special functionality might be required
 * with this element in the future. I wonder if there's a way to create a
 * myRatioMedia directive that could serve as a sort of parent class? Much of
 * the actual ratio implementation is identical.
 */
angular
    .module('portfolio')
    .directive('myRatioVideo', function ($log, $window)
    {
        var directiveDefinitionObject =
        {
            restrict: 'E',
            template: function(tElement, tAttrs)
            {
                $log.debug('In the video element.');

                var template = '<div class="media">';

                // Not using a psuedo-element to create the padding that
                // represents the ratio because it's a mess to work with
                // dynamically.
                template += '<div class="ratio"></div>';

                template += '<iframe ng-src="' + tAttrs.path + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen my-preloader></iframe>';

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

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
