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
    .factory('MenuState', function ($log)
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

        var _hamburgerIcon;

        var _currContentElement;

        var _contentPositionY;

        service.setHamburgerIcon = function( element )
        {
            _hamburgerIcon = element;
        };

        service.setContentPosition = function( element )
        {
            if ( element )
            {
                _currContentElement = element;
            }

            if ( _currContentElement )
            {
                _contentPositionY = _currContentElement.offset().top;
            }

            $log.debug('The content position from MenuState: %s', _contentPositionY);
        };

        service.getContentPosition = function()
        {
            service.setContentPosition();

            return _contentPositionY;
        };

        service.removeContentPosition = function()
        {
            _currContentElement = undefined;
            _contentPositionY = undefined;
        };

        service.isCollapsible = function()
        {
            return ( _hamburgerIcon.filter(':visible').length > 0 ) ? true : false;
        };

        // Public API
        return service;
    });
