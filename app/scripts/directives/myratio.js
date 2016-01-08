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
            restrict: 'E',
            transclude: true,
            templateUrl: 'views/ratio.html',
            controller: function($scope, $element, $attrs)
            {
                var self = this;

                self.element = $element;

                // $log.debug('The attributes: %o', $attrs);

                // $log.debug('The scope width: %s', $scope.width);
                // $log.debug('The scope height: %s', $scope.height);

                var _width = ( $scope.fullSize === 'true' ) ? '100%' : $scope.width;

                $scope.ratio = null;

                var _init = function()
                {
                    self.setMediaContainer();
                    self.setRatio();
                    self.setElementStyles();
                };

                self.setMediaContainer = function()
                {
                    if ( _width )
                    {
                        $element
                            .find('.media')
                            .css(
                            {
                                position: 'relative',
                                top: 0,
                                left: 0,
                                width: _width,
                                maxWidth: $scope.width
                            });
                    }
                    else
                    {
                        $log.error('The aspect ratio element requires a width.');
                    }

                };

                // These styles are set here because they are necessary in
                // this precise manner for the ratio to work. Further, a
                // CSS pre-compiler mixin makes less sense when dynamic data
                // is involved as part of the calculation.
                self.setRatio = function()
                {
                    if ( $scope.height && $scope.width )
                    {
                        // $log.debug('The ratio was calculated from: %s, %s', $scope.height, $scope.width);

                        $scope.ratio = $scope.height / $scope.width * 100;
                    }

                    if ( $scope.ratio )
                    {
                        // Not using a psuedo-element to create the padding that
                        // represents the ratio because it's a mess to work with
                        // dynamically.
                        $element
                            .find('.ratio')
                            .css(
                            {
                                paddingTop: $scope.ratio + '%',
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

                self.setElementStyles = function()
                {
                    $element.width( $scope.width );
                };

                _init();
            }
        };

        return directiveDefinitionObject;
    });
