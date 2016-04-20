'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myRatio
 * @description
 * # myRatio
 * This directive serves as a base to objects that rely on aspect ratio.
 */
angular
    .module('portfolio')
    .directive('myRatio', function ($log)
    {
        var directiveDefinitionObject =
        {
            restrict: 'EA',
            transclude: true,
            //scope: true, // Create child scope to be shared with other directives on same element.
            scope:
            {
                fullSize: '=',
                height: '=',
                width: '='
            },
            //templateUrl: 'views/ratio.html',
            template: function()
            {
                return '<div class="media"><div class="ratio"></div><ng-transclude></ng-transclude></div>';
            },
            link: function(scope, iElement)
            {
                var self = {};

                scope.ratio = null;

                scope.fullWidth = ( scope.fullSize === 'true' ) ? '100%' : scope.width;

                self.init = function()
                {
                    self.setRatio();
                    self.setMediaContainer();
                };

                // These styles are set here because they are necessary in
                // this precise manner for the ratio to work. Further, a
                // CSS pre-compiler mixin makes less sense when dynamic data
                // is involved as part of the calculation.
                self.setRatio = function()
                {
                    if ( scope.height && scope.width )
                    {
                        scope.ratio = scope.height / scope.width * 100;
                    }

                    if ( scope.ratio )
                    {
                        // Not using a psuedo-element to create the padding that
                        // represents the ratio because it's a mess to work with
                        // dynamically.
                        iElement
                            .find('.ratio')
                            .css(
                            {
                                paddingTop: scope.ratio + '%',
                                position: 'relative',
                                    top: 0,
                                    left: 0
                            });
                    }
                    else
                    {
                        $log.error('Both a height and width must be supplied to calculate the ratio.');
                    }
                };

                self.setMediaContainer = function()
                {
                    if ( scope.width )
                    {
                        iElement
                            .find('.media')
                            .css(
                            {
                                position: 'relative',
                                top: 0,
                                left: 0,
                                width: scope.fullWidth,
                                maxWidth: scope.width
                            });
                    }
                    else
                    {
                        $log.error('The aspect ratio element requires a width.');
                    }
                };

                self.setElementStyles = function()
                {
                    iElement.width( scope.width );
                };

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
