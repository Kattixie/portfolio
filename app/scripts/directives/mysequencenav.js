'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySequenceNav
 * @description
 * # mySequenceNav
 */
angular
    .module('portfolio')
    .directive('mySequenceNav', function ($log, $window, $location, $routeParams, WindowState, MenuState, Keyboard)
    {
        return {
            restrict: 'E',
            controllerAs: 'sequenceNav',
            scope: true,
            // bindToController: true,
            templateUrl: 'views/sequencenav.html',
            controller: function($scope, $element)
            {
                var ctrl = this;

                ctrl.container = $element.find('nav');
                ctrl.buttonsContainer = $element.find('.buttons-directional');

                ctrl.init = function()
                {
                    ctrl.setCompactedDefaults();

                    MenuState.addScrollbarPaddedElement( ctrl.buttonsContainer );
                };

                ctrl.setCompactedDefaults = function()
                {
                    // This ties the container to MenuState behavior so that
                    // we don't have to duplicate behavior here that exists
                    // in other core menu directives.
                    MenuState.addCompactibleElement( ctrl.container );
                };

                ctrl.prevExists = function()
                {
                    $log.debug('mySequenceNav', 'Does a previous URI exist?', MenuState.prevExists());

                    return MenuState.prevExists();
                };

                ctrl.nextExists = function()
                {
                    $log.debug('mySequenceNav', 'Does a next URI exist?', MenuState.nextExists());

                    return MenuState.nextExists();
                };

                // Event Handlers

                ctrl.onPrev = function()
                {
                    $log.debug('mySequenceNav', 'What is the previous URI? %s', MenuState.getPrevURI());

                    $location.url( MenuState.getPrevURI() );
                };

                ctrl.onNext = function()
                {
                    $log.debug('mySequenceNav', 'What is the next URI? %s', MenuState.getNextURI());

                    $location.url( MenuState.getNextURI() );
                };

                // This specifically looks for a slug and sets a class that
                // determines how sequential navigational elements should
                // display before MenuState has figured out what to do. It
                // assumes sequential elements will have a slug value of some
                // sort to distinguish between elements in the sequence.
                ctrl.onRouteChange = function()
                {
                    if ( $routeParams.slug )
                    {
                        ctrl.container.addClass('sequenced');
                    }
                    else
                    {
                        ctrl.container.removeClass('sequenced');
                    }
                };

                Keyboard.on('LEFT', function()
                {
                    if ( $routeParams.slug )
                    {
                        ctrl.onPrev();
                    }
                });

                Keyboard.on('RIGHT', function()
                {
                    if ( $routeParams.slug )
                    {
                        ctrl.onNext();
                    }
                });

                $scope.$on('$routeChangeSuccess', ctrl.onRouteChange);

                ctrl.init();
            }
        };
    });
