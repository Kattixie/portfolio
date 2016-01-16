'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySideItem
 * @description
 * # mySideItem
 */
angular
    .module('portfolio')
    .directive('mySideItem', function ($log, $window, $timeout, MenuState)
    {
        var directiveDefinitionObject =
        {
            restrict: 'E',
            require: '^mySyncedColumns',
            scope:
            {
                media: '=data'
            },
            templateUrl: 'views/sideitem.html',
            link: function(scope, iElement, iAttrs, columnsCtrl)
            {
                var self = {};

                scope.id = scope.media.id;
                scope.height = 0;
                scope.marginTop = 0;

                // You know, I use this enough that I should really find a
                // better place for it to live.
                self.eWindow = angular.element( $window );

                scope.marginTop = iElement.css('marginTop');

                var _heightTO = null,
                    _resizeTO = null;

                self.init = function()
                {
                    /*
                    iElement.css(
                    {
                        display: 'block',
                        overflow: 'hidden'
                    });
                    */

                    columnsCtrl.setMediaItem( scope );

                    self.setMargin();
                };

                self.setMargin = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        // Set to original margin top.

                        iElement.css('marginTop', scope.marginTop);
                    }
                    else
                    {
                        var offset = columnsCtrl.getMarkerPosition( scope.id );

                        if ( offset )
                        {
                            var occupiedSpace = columnsCtrl.prevSideItemsHeight( scope.id );

                            iElement.css('marginTop', offset - occupiedSpace);
                        }
                    }
                };

                // A problem with calculating height at this point is that
                // variables in the template have not been interpolated. As a
                // result, text that becomes multiple lines afterward could
                // create a taller element than what was calculated here.
                scope.getHeight = function()
                {
                    // outerHeight includes the element height, border, and
                    // padding. Margin will only be included if an optional
                    // true param is passed to the function.

                    $log.debug('Evaluating height for item with text: %s', iElement.find('.brief').text() );

                    //return iElement.outerHeight() + parseInt( iElement.css('marginTop') );

                    return iElement.outerHeight(true);
                };

                self.onHeightTO = function()
                {
                    _heightTO = null;

                    var height = iElement.outerHeight();

                    if (scope.height !== height)
                    {
                        scope.$apply(function()
                        {
                            scope.height = height;

                            self.setMargin();
                        });
                    }
                };

                self.onWindowResize = function()
                {
                    if ( ! _resizeTO )
                    {
                        _resizeTO = $timeout( function()
                        {
                            _resizeTO = null;

                            self.setMargin();

                        }, 50);
                    }
                };

                self.onMouseOver = function()
                {
                    columnsCtrl.highlightMarker( scope.id );
                };

                self.onMouseOut = function()
                {
                    columnsCtrl.unhighlightMarker( scope.id );
                };

                self.onDestroy = function()
                {
                    $timeout.cancel( _heightTO );
                    $timeout.cancel( _resizeTO );
                };

                // Borrowed from: http://stackoverflow.com/a/31884266
                scope.$watch(function()
                {
                    if ( ! _heightTO )
                    {
                        _heightTO = $timeout(self.onHeightTO, 50);
                    }
                });

                scope.$on('$destroy', self.onDestroy);

                iElement.on('mouseover', self.onMouseOver );
                iElement.on('mouseout', self.onMouseOut );

                self.eWindow.on('resize', self.onWindowResize);

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
