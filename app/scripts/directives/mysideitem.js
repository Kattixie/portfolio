'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySideItem
 * @description
 * # mySideItem
 */
angular
    .module('portfolio')
    .directive('mySideItem', function ($log, $timeout)
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

                var _heightTO = null;

                self.init = function()
                {
                    iElement.css(
                    {
                        display: 'block',
                        overflow: 'hidden'
                    });

                    columnsCtrl.setMediaItem( scope );

                    self.setMargin();
                };

                self.setMargin = function()
                {
                    var offset = columnsCtrl.getMarkerPosition( scope.id );

                    if ( offset )
                    {
                        var occupiedSpace = columnsCtrl.prevSideItemsHeight( scope.id );
                        //var occupiedSpace = 0;

                        iElement
                            .find('.inner-sidebar')
                            .css('marginTop', offset - occupiedSpace);
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

                    return iElement.outerHeight(true);
                };

                self.onHeightTO = function()
                {
                    _heightTO = null;

                    var height = iElement.height();

                    if (scope.height !== height)
                    {
                        scope.$apply(function()
                        {
                            scope.height = height;

                            self.setMargin();
                        });
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
                };

                iElement.on('mouseover', self.onMouseOver );
                iElement.on('mouseout', self.onMouseOut );

                // Borrowed from: http://stackoverflow.com/a/31884266
                scope.$watch(function()
                {
                    if ( ! _heightTO )
                    {
                        _heightTO = $timeout(self.onHeightTO, 50);
                    }
                });

                scope.$on('$destroy', self.onDestroy);

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
