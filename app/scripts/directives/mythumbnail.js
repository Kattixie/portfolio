'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myThumbnail
 * @description
 * # myThumbnail
 */
angular
    .module('portfolio')
    .directive('myThumbnail', function ($log, $window, $timeout, GalleryState)
    {
        var directiveDefinitionObject =
        {
            restrict: 'EA',
            scope: {
                entry: '=data'
            },
            templateUrl: 'views/entry-thumbnail.html',
            link: function(scope, element)
            {
                $log.debug('The thumbnail scope: %o', scope);

                var self = {};

                self.eWindow = angular.element( $window );
                self.element = element;
                self.image = element.find('img');
                self.resizeTO = null;

                scope.sizeClassName = '';

                var delay       =   100,
                    duration    =   250;

                // We need to set a class to determine how to display thumbnail
                // contents because the width of the thumbnail is dynamic. The
                // width provides us some insight on how much real estate we
                // have on this particular screen.
                self.setSizeClass = function()
                {
                    var width = self.image.width();

                    if ( width <= GalleryState.smallWidth )
                    {
                        scope.sizeClassName = GalleryState.smallClassName;
                    }
                    else if ( width <= GalleryState.mediumWidth )
                    {
                        scope.sizeClassName = GalleryState.mediumClassName;
                    }
                    else
                    {
                        scope.sizeClassName = GalleryState.maxClassName;
                    }

                    // $log.debug('The class name is: %s', scope.sizeClassName);
                };

                // I noticed some lagginess with the thumbnail animations with
                // straight CSS. They seem to perform better with Velocity.

                self.onElementHover = function()
                {
                    if ( ! self.image.hasClass('velocity-animating') )
                    {
                        self.image
                            .velocity(
                            {
                                top: -1 * self.image.height()
                            },
                            {
                                delay:  delay,
                                duration: duration,
                                easing: 'easeInBack'
                            });
                    }
                };

                self.offElementHover = function()
                {
                    self.image
                        .velocity(
                        {
                            top: 0
                        },
                        {
                            delay:  delay,
                            duration: duration,
                            easing: 'easeOutBack'
                        });
                };

                self.onWindowResize = function()
                {
                    if ( self.resizeTO )
                    {
                        $timeout.cancel( self.resizeTO );
                    }

                    self.resizeTO = $timeout( function()
                    {
                        self.setSizeClass();

                    }, 500);
                };

                self.onDestroy = function()
                {
                    self.element.off('mouseenter', 'mouseleave');

                    self.eWindow.unbind('resize', self.onWindowResize);

                    $timeout.cancel( self.resizeTO );
                };

                self.element.on(
                {
                    mouseenter: self.onElementHover,
                    mouseleave: self.offElementHover
                });

                scope.$on('$destroy', self.onDestroy);

                self.eWindow.bind('resize', self.onWindowResize);

                self.setSizeClass();
            }
        };

        return directiveDefinitionObject;
    });
