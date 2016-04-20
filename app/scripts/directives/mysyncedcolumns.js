'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySyncColumns
 * @description
 * # mySyncColumns
 */
angular
    .module('portfolio')
    .directive('mySyncedColumns', function ($log)
    {
        return {
            restrict: 'E',
            //transclude: true,
            controller: function($scope, $element)
            {
                var self = this;

                var mediaItems = $scope.mediaItems = [];

                // Array of inline text markers to attempt syncing with sidebar
                // media.
                self.markers = null;

                self.init = function()
                {
                    // Setting styles here because this element otherwise
                    // doesn't act like a good parent for positioning
                    // calculation. Also, does it make sense to apply styles to
                    // fake tags from our CSS file? I'm conflicted.
                    $element.css(
                    {
                        display: 'block',
                        overflow: 'hidden'
                    });

                    $log.debug('The content block is initiated.');
                };

                self.setInlineMarkers = function()
                {
                    // Note that markers have data attributes stripped from
                    // ngSanitize.
                    self.markers = $element.find('.side-photo-link');

                    $log.debug('The number of markers: %d', self.markers.length);
                };

                self.getMarkerPosition = function( mediaId )
                {
                    var offset = 0;

                    // This is most likely a "p" element.
                    var markerParent = self.markers.eq( mediaId - 1 ).parent();

                    // Get position of the parent relative to the larger
                    // container.
                    var position = markerParent.position();

                    if ( position.top )
                    {
                        offset += position.top;
                    }

                    return offset + parseInt( markerParent.css('marginTop') );
                };

                self.prevSideItemsHeight = function( mediaId )
                {
                    var height = 0;

                    for (var i = 0; i < mediaItems.length && i < mediaId - 1 ; i++)
                    {
                        height += mediaItems[ i ].getHeight();
                    }

                    return height;
                };

                self.highlightMarker = function( mediaId )
                {
                    var marker = self.markers.eq( mediaId - 1 );

                    marker
                        .addClass('highlight');
                };

                self.unhighlightMarker = function( mediaId )
                {
                    var marker = self.markers.eq( mediaId - 1 );

                    marker
                        .removeClass('highlight');
                };

                self.setMediaItem = function( media )
                {
                    // See if there's another way to invoke this function once
                    // elements are available.
                    if ( self.markers === null )
                    {
                        self.setInlineMarkers();
                    }

                    mediaItems.push( media );
                };

                self.init();
            }
        };
    });
