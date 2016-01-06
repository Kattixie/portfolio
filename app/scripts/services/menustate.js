'use strict';

/**
 * @ngdoc service
 * @name portfolio.MenuState
 * @description
 * # MenuState
 * Service that maintains information about menu state, which is helpful in
 * cases where we don't want to worry about controller and directive
 * relationships (parent vs. child, siblings, etc).
 */
angular
    .module('portfolio')
    .factory('MenuState', function ()
    {
        var service =
        {
            selectedGalleryMode:    null,
            isOpen:                 false,
            isCompact:              false,
            isCentered:             false,

            collapsedClassName:     'collapsed',
            compactClassName:       'compact',
            activeClassName:        'active',
            centerClassName:        'centered'
        };

        // Public API
        return service;
    });
