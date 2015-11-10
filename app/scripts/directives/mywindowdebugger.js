'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myWindowDebugger
 * @description
 * # myWindowDebugger
 */
angular
    .module('portfolio')
    .directive('myWindowDebugger', function ($log, $window)
    {
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs)
            {
                var self = this;

                // Values

                self.scrollbarWidth = null;

                // Elements

                self.eWindow = angular.element( $window );

                self.debugDiv = angular.element( '<div>' );

                self.debugDiv
                    .addClass('debug')
                    .addClass('debug-box')
                    .appendTo( $element );

                self.mockThumbs = [];

                // Functions

                self.setScrollbarWidth = function()
                {
                    var scrollDiv = angular.element( '<div>' );

                    scrollDiv.css(
                    {
                        height: 100,
                        overflow: 'scroll',
                        position: 'absolute',
                        width: 100
                    })
                    .appendTo ( $element );

                    //var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

                    // In the case of no padding/margin, these produce identical
                    // values of width 100.
                    // $log.debug( 'The div width: %s', scrollDiv.width() );
                    // $log.debug( 'The div innerWidth: %s', scrollDiv.innerWidth() );
                    // $log.debug( 'The div outerWidth: %s', scrollDiv.outerWidth() );
                    // $log.debug( 'The div raw offsetWidth: %s', scrollDiv[0].offsetWidth );

                    // This value is the available width NOT including the
                    // scrollbar. I could not find a way to retrieve this value
                    // with jQuery, at least on a standard div element. It's
                    // another story on the window object, which excludes the
                    // scrollbar width with a simple jQuery(window).width()
                    // call. Consistent, right?
                    // $log.debug( 'The div raw clientWidth: %s', scrollDiv[0].clientWidth );

                    self.scrollbarWidth = scrollDiv.width() - scrollDiv[0].clientWidth;

                    scrollDiv.remove();

                    $log.debug('The scrollbar width is: %s', self.scrollbarWidth);
                };

                self.setMockColumns = function()
                {
                    if ( self.mockThumbs.length )
                    {
                        for ( var i = 0; i < self.mockThumbs.length; i++ )
                        {
                            self.mockThumbs[i].remove();
                        }

                        self.mockThumbs = [];
                    }

                    // This works swimmingly so long as you can guarantee the
                    // app is loaded and scrollbars are accounted for.
                    // var numColumns = Math.floor( self.eWindow.width() / $attrs.thumbnailWidth );
                    var numColumns = Math.floor( ( $window.innerWidth - self.scrollbarWidth ) / $attrs.thumbnailWidth );

                    for ( var j = 0; j < numColumns; j++ )
                    {
                        self.mockThumbs[j] = angular.element( '<div>');
                        self.mockThumbs[j].css(
                        {
                            background: '#000',
                            height: 10,
                            opacity: 1 - 0.3 * j,
                            position: 'absolute',
                                top: 0,
                                left: $attrs.thumbnailWidth * j,
                                zIndex: self.debugDiv.css('z-index') + 1,
                            width: $attrs.thumbnailWidth
                        })
                        .appendTo( $element );
                    }
                };

                self.getMediaQueryContent = function()
                {
                    // jQuery offers little help with selecting psuedo elements.
                    var afterPseudoElement = $window.getComputedStyle ? $window.getComputedStyle( $element[0], '::after') : false;

                    if ( ! afterPseudoElement )
                    {
                        return 'none';
                    }

                    return afterPseudoElement.getPropertyValue('content');
                };

                self.onWindowResize = function()
                {
                    self.setMockColumns();

                    self.debugDiv.html( 'Viewport with scrollbar (media queries): ' + $window.innerWidth );

                    // This is a little buggy because the window width is
                    // calculated before the app is fully loaded. On first load,
                    // the scrollbar doesn't seem to exist yet. Resizing the
                    // window manually will account for it, however.
                    //self.debugDiv.append( '<br>Width excluding scrollbar: ' + self.eWindow.width() );

                    // Assume a scrollbar exists for now.
                    self.debugDiv.append( '<br>Actual width available: ' + ( $window.innerWidth - self.scrollbarWidth ) );

                    self.debugDiv.append( '<br>Current top-level query: ' + self.getMediaQueryContent() );
                };

                self.eWindow.bind('resize', self.onWindowResize);

                self.setScrollbarWidth();

                // I don't know why, but I can't find an event that allows me
                // to call jQuery(window).width() after the app has loaded and
                // scrollbars are accounted for. The following did not work:
                //     $(document).ready
                //     $(window).load
                //     $scope.on('$viewContentLoaded')
                self.eWindow.load( self.onWindowResize );
            }
        };
    });
