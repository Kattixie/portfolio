'use strict';

/**
 * @ngdoc service
 * @name portfolio.LoadState
 * @description
 * # LoadState
 * Service that maintains information about gallery state.
 */
angular
    .module('portfolio')
    .factory('LoadState', function ()
    {
        var service =
        {
            loadingClassName:   'loading',
            completeClassName:  'complete'
        };

        // Public API
        return service;
    });
