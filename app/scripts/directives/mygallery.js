'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myGallery
 * @description
 * # myGallery
 */
angular
    .module('portfolio')
    .directive('myGallery', function ($log, $timeout, LoadState)
    {
        return {
            restrict: 'E',
            scope:
            {
                items: '='
            },
            templateUrl: 'views/gallery.html',
            bindToController: true,
            controllerAs: 'gallery',
            controller: function($scope, $element)
            {
                // Dude. Not using 'this' keyword results in any directives
                // that require this one to not have access to functions here.
                // var ctrl = $scope;

                var ctrl = this;

                var _elements =
                {
                    items: [],
                    loader: $element.find('.loader')
                };

                var _numLoaded = 0,
                    _inHighlightMode;

                angular.extend($scope,
                {
                    loadingStateClassName: LoadState.loadingClassName
                });

                ctrl.init = function()
                {
                    ctrl.setLoadingState();
                    ctrl.setHighlightMode(false);
                };

                ctrl.setLoader = function()
                {
                    _elements.loader.css('height', _elements.items[0].getHeight());
                };

                ctrl.setLoadingState = function()
                {
                    ctrl.loadingStateClassName = LoadState.loadingClassName;
                };

                ctrl.setCompleteState = function()
                {
                    ctrl.loadingStateClassName = LoadState.completeClassName;
                };

                ctrl.isLoaded = function()
                {
                    return _numLoaded === _elements.items.length;
                };

                ctrl.setItem = function( item )
                {
                    _elements.items.push( item );

                    if (_elements.items.length === 1)
                    {
                        // ctrl.setLoader();
                    }
                };

                ctrl.setItemLoaded = function( index )
                {
                    _numLoaded++;

                    $log.debug('myGallery', 'Adding item loaded: %s', index);
                    $log.debug('myGallery', 'Number loaded: %s', _numLoaded);

                    if (ctrl.isLoaded())
                    {
                        $log.debug('myGallery', 'All items have loaded...');

                        ctrl.setCompleteState();
                    }
                };

                ctrl.highlightItem = function( index )
                {
                    if (ctrl.isLoaded())
                    {
                        for (var i = 0; i < _elements.items.length; i++)
                        {
                            if ( i === index )
                            {
                                _elements.items[i].setHighlight(true);
                            }
                            else
                            {
                                _elements.items[i].setHighlight(false);
                            }
                        }
                    }
                };

                ctrl.setHighlightMode = function(inHighlightMode)
                {
                    if ( _inHighlightMode !== inHighlightMode )
                    {
                        _inHighlightMode = inHighlightMode;
                    }
                };

                ctrl.inHighlightMode = function()
                {
                    return _inHighlightMode;
                };

                ctrl.init();
            }
        };
    });
