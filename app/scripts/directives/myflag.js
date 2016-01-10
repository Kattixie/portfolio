'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myFlag
 * @description
 * # myFlag
 * This directive creates a flag element for use over other elements.
 */
angular
    .module('portfolio')
    .directive('myFlag', function ($log, $timeout)
    {
        var directiveDefinitionObject =
        {
            restrict: 'E',
            transclude: true,
            require: '^myRatioImg',
            scope:
            {
                targetPosition: '=',
                offset: '='
            },
            templateUrl: 'views/flag.html',
            link: function(scope, iElement, iAttrs, imageCtrl)
            {
                var self = {};

                $log.debug('The image height: %s', imageCtrl.getHeight() );

                var imageWidth = imageCtrl.getWidth(),
                    imageHeight = imageCtrl.getHeight();

                var flagWrapper = iElement.find('.flag-percent'),
                    flagElement = iElement.find('.flag'),
                    pointerElement = iElement.find('.pointer');

                self.init = function()
                {
                    iElement
                        .css(
                        {
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%'
                        });

                    self.setPosition();
                };

                self.setPosition = function()
                {
                    flagWrapper
                        .css(
                        {
                            position: 'absolute',
                            top: _calcAsPercentage( scope.targetPosition.y + scope.offset.top, imageHeight ),
                            left: _calcAsPercentage( scope.targetPosition.x + scope.offset.left, imageWidth )
                        });

                    // This position must be set independent of the percent
                    // calculation because the size of the flag and its content
                    // is static compared to a scaled image.
                    var top = -1 * parseInt( flagElement.outerHeight() );

                    top -= parseInt( pointerElement.outerHeight() );

                    flagElement
                        .css(
                        {
                            position: 'relative',
                            top: top
                        });
                };

                var _calcAsPercentage = function( position, range )
                {
                    return ( position / range * 100 ) + '%';
                };

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
