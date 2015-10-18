'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myThumbnail
 * @description
 * # myThumbnail
 */
angular
    .module('portfolio')
    .directive('myThumbnail', function ()
    {
        return {
            restrict: 'A',
            // templateUrl: 'views/entry-thumbnail.html',
            link: function(scope, element)
            {
                // I noticed some lagginess with the thumbnail animations with
                // straight CSS. They seem to perform better with Velocity.

                var delay       =   100,
                    duration    =   250,
                    image       =   element.find('img');

                element.hover(
                    function()
                    {
                        if ( ! image.hasClass('velocity-animating') )
                        {
                            image
                                .velocity(
                                {
                                    top: -1 * image.height()
                                },
                                {
                                    delay:  delay,
                                    duration: duration,
                                    easing: 'easeInBack'
                                });
                        }
                    },
                    function()
                    {
                        image
                            .velocity(
                            {
                                top: 0
                            },
                            {
                                delay:  delay,
                                duration: duration,
                                easing: 'easeOutBack'
                            });
                    });
            }
        };
    });
