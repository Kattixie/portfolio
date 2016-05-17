'use strict';

/**
 * @ngdoc service
 * @name portfolio.GalleryState
 * @description
 * # GalleryState
 * Service that maintains information about gallery state.
 */
angular
    .module('portfolio')
    .factory('GalleryState', function ()
    {
        var service =
        {
            maxWidth:           465,
            mediumWidth:        400,
            smallWidth:         315,

            maxClassName:       'large',
            mediumClassName:    'medium',
            smallClassName:     'small'
        };

        // Public API
        return service;
    });
