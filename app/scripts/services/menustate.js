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
    .factory('MenuState', function ($log, $animate)
    {
        var service =
        {
            selectedGalleryMode:    null,

            collapsedClassName:     'collapsed',
            compactClassName:       'compact',
            activeClassName:        'active',
            centerClassName:        'centered'
        };

        var _isCompact = false,
            _isCollapsed = false,
            _isCentered = false;

        var _icon;

        var _currContentElement;

        var _contentPositionY;

        var _collapsibleElements = [];

        var _compactibleElements = [];

        var _centerableElements = [];

        var _prevURI,
            _nextURI;

        service.isCompacted = function()
        {
            return _isCompact;
        };

        service.isCollapsed = function()
        {
            return _isCollapsed;
        };

        service.isCentered = function()
        {
            return _isCentered;
        };

        service.setIcon = function( element )
        {
            _icon = element;
        };

        service.getIconHeight = function()
        {
            return _icon.outerHeight();
        };

        service.addCollapsibleElement = function( element )
        {
            _collapsibleElements.push(element);
        };

        service.addCompactibleElement = function( element )
        {
            $log.debug('MenuState', 'Adding a compactible element.');

            _compactibleElements.push(element);
        };

        service.addCenterableElement = function( element )
        {
            _centerableElements.push(element);
        };

        service.setCompacted = function( isCompact )
        {
            var switchedState = ( _isCompact !== isCompact );

            // $log.debug('MenuState', 'Comparing passed compact state to set compact state: %s vs. %s', isCompact, _isCompact);

            if ( ! switchedState )
            {
                // $log.debug('MenuState', 'The compact state has not changed.');

                return switchedState;
            }

            // $log.debug('MenuState', 'Changing compact state to: %s', isCompact);

            _isCompact = isCompact;

            // $log.debug('MenuState', 'The number of compactible elements: %s', _compactibleElements.length);

            for (var i = 0; i < _compactibleElements.length; i++)
            {
                if ( _isCompact)
                {
                    // Adds following classes in order:
                    // ng-animate
                    // [service.compactClassName]-add
                    // [service.compactClassName]
                    // [service.compactClassName]-add-active
                    $animate.addClass(_compactibleElements[i], service.compactClassName);

                    /*
                    if ( ! _compactibleElements[i].hasClass(service.compactClassName) )
                    {
                        _compactibleElements[i].addClass(service.compactClassName);
                    } */
                }
                else
                {
                    // Adds following classes in order:
                    // ng-animate
                    // [service.compactClassName]-remove
                    // [service.compactClassName]-remove-active
                    $animate.removeClass(_compactibleElements[i], service.compactClassName);

                    /*
                    if ( _compactibleElements[i].hasClass(service.compactClassName))
                    {
                        _compactibleElements[i].removeClass(service.compactClassName);
                    }
                    */
                }
            }

            return switchedState;
        };

        service.setCollapsed = function( isCollapsed )
        {
            var switchedState = ( _isCollapsed !== isCollapsed );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isCollapsed = isCollapsed;

            for (var i = 0; i < _collapsibleElements.length; i++)
            {
                if ( _isCollapsed )
                {
                    _collapsibleElements[i].addClass(service.collapsedClassName);
                }
                else
                {
                    _collapsibleElements[i].removeClass(service.collapsedClassName);
                }
            }

            return switchedState;
        };

        service.setCentered = function( isCentered )
        {
            var switchedState = ( _isCentered !== isCentered );

            if ( ! switchedState )
            {
                return switchedState;
            }

            _isCentered = isCentered;

            for (var i = 0; i < _centerableElements.length; i++)
            {
                if ( _isCentered )
                {
                    if ( ! _centerableElements[i].hasClass(service.centerClassName) )
                    {
                        _centerableElements[i].addClass(service.centerClassName);
                    }
                }
                else
                {
                    _centerableElements[i].removeClass(service.centerClassName);
                }
            }

            return switchedState;
        };

        service.setContentPosition = function( element, entrancePoint )
        {
            if ( element )
            {
                _currContentElement = element;
            }

            if ( _currContentElement )
            {
                _contentPositionY = _currContentElement.offset().top;
            }

            if ( entrancePoint )
            {
                $log.debug('MenuState', 'Applying an offset... %s', _currContentElement.height() * entrancePoint);

                _contentPositionY = _contentPositionY + _currContentElement.height() * entrancePoint;
            }

            $log.debug('MenuState', 'The content position: %s', _contentPositionY);
        };

        service.getContentPosition = function()
        {
            // service.setContentPosition();

            return _contentPositionY;
        };

        service.removeContentPosition = function()
        {
            _currContentElement = undefined;
            _contentPositionY = undefined;
        };

        service.isCollapsible = function()
        {
            return ( _icon.filter(':visible').length > 0 ) ? true : false;
        };

        service.setPrevURI = function(uri)
        {
            _prevURI = uri;
        };

        service.setNextURI = function(uri)
        {
            _nextURI = uri;
        };

        service.prevExists = function()
        {
            if (_prevURI)
            {
                return true;
            }

            return false;
        };

        service.nextExists = function()
        {
            if (_nextURI)
            {
                return true;
            }

            return false;
        };

        service.getPrevURI = function()
        {
            return _prevURI;
        };

        service.getNextURI = function()
        {
            return _nextURI;
        };

        // Public API
        return service;
    });
