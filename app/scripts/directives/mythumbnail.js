'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myThumbnail
 * @description
 * # myThumbnail
 */
angular
    .module('portfolio')
    .directive('myThumbnail', function ($log, $timeout, WindowState, LoadState, GalleryState)
    {
        return {
            restrict: 'E',
            require: '^myGallery',
            templateUrl: 'views/entry-thumbnail.html',
            link: function(scope, iElement, iAttrs, galleryCtrl)
            {
                var vm = scope;

                var _elements =
                {
                    container: iElement.find('li'),
                    image: iElement.find('img'),
                    loader: iElement.find('loader')
                };

                var _timeoutIds =
                {
                    resize: undefined,
                    scroll: undefined
                };

                var _isHighlighted = false;

                angular.extend(vm,
                {
                    delay: 100,
                    duration: 250,
                    sizeClassName: '',
                    loadingStateClassName: LoadState.loadingClassName
                });

                vm.init = function()
                {
                    // $log.debug('myThumbnail', 'The item index: %s', vm.index);

                    galleryCtrl.setItem(scope);

                    // vm.setLoadingState();
                    vm.setSizeClass();

                    _setEventListeners();
                };

                /* LOADING */

                vm.setLoadingState = function()
                {
                    vm.setLoadingStateClassName(LoadState.loadingClassName);
                };

                vm.setCompleteState = function()
                {
                    vm.setLoadingStateClassName(LoadState.completeClassName);

                    galleryCtrl.setItemLoaded( vm.index );
                };

                vm.setLoadingStateClassName = function(className)
                {
                    vm.loadingStateClassName = className;

                    _digest();
                };

                /* SIZE */

                // We need to set a class to determine how to display thumbnail
                // contents because the width of the thumbnail is dynamic. The
                // width provides us some insight on how much real estate we
                // have on this particular screen.
                vm.setSizeClass = function()
                {
                    var width = _elements.image.width();

                    if ( width <= GalleryState.smallWidth )
                    {
                        vm.sizeClassName = GalleryState.smallClassName;
                    }
                    else if ( width <= GalleryState.mediumWidth )
                    {
                        vm.sizeClassName = GalleryState.mediumClassName;
                    }
                    else
                    {
                        vm.sizeClassName = GalleryState.maxClassName;
                    }

                    // $log.debug('myThumbnail', 'The class name is: %s', vm.sizeClassName);

                    _digest();
                };

                vm.getSizeClass = function()
                {
                    $log.debug('myThumbnail', 'Requesting size class...');

                    return vm.sizeClassName;
                };

                vm.getHeight = function()
                {
                    return iElement.height();
                };

                /* MOUSE EFFECTS */

                // I noticed some lagginess with the thumbnail animations with
                // straight CSS. They seem to perform better with Velocity.

                vm.onElementHover = function()
                {
                    if ( ! _elements.image.hasClass('velocity-animating') )
                    {
                        _elements.image
                            .velocity(
                            {
                                top: _elements.image.height(),
                                // top: -1 * _elements.image.height()
                            },
                            {
                                delay:  vm.delay,
                                duration: vm.duration,
                                easing: 'easeInBack'
                            });
                    }
                };

                vm.offElementHover = function()
                {
                    _elements.image
                        .velocity(
                        {
                            top: 0
                        },
                        {
                            delay:  vm.delay,
                            duration: vm.duration,
                            easing: 'easeOutBack'
                        });
                };

                vm.setHighlight = function(isHighlighted)
                {
                    if ( _isHighlighted !== isHighlighted )
                    {
                        _isHighlighted = isHighlighted;
                    }
                };

                vm.isHighlighted = function()
                {
                    $log.debug('myThumbnail', 'Is the gallery in highlight mode? %s', galleryCtrl.inHighlightMode());

                    if ( ! galleryCtrl.inHighlightMode() )
                    {
                        return true;
                    }

                    return _isHighlighted;
                };

                /* EVENT LISTENERS */

                var _onWindowResize = function()
                {
                    $log.debug('myThumbnail', 'The window has resized, setting class...');

                    vm.setSizeClass();
                };

                var _onDestroy = function()
                {
                    iElement.off('mouseenter', 'mouseleave');
                    _elements.image.off('load');

                    WindowState.destroyResize( _timeoutIds.resize, 'thumbnail' );
                };

                var _setEventListeners = function()
                {
                    scope.$on('$destroy', _onDestroy);

                    iElement.on(
                    {
                        mouseenter: vm.onElementHover,
                        mouseleave: vm.offElementHover
                    });

                    _elements.image.on('load', vm.setCompleteState);

                    _timeoutIds.resize = WindowState.onResize(_onWindowResize, 'thumbnail', 300);
                };

                /* DIGEST */

                var _digest = function()
                {
                    $timeout();
                };

                vm.init();
            }
        };
    });
