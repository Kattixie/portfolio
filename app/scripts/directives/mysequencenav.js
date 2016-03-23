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
            transclude: true,
            templateUrl: 'views/sequencenav.html',
            controller: function($scope, $element)
            {
                var ctrl = this;

                ctrl.container = $element.find('nav');

                ctrl.init = function()
                {
                    ctrl.setCompactedDefaults();
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
                    return MenuState.prevExists();
                };

                ctrl.nextExists = function()
                {
                    return MenuState.nextExists();
                };

                // Event Handlers

                ctrl.onPrev = function()
                {
                    $location.url( MenuState.getPrevURI() );
                };

                ctrl.onNext = function()
                {
                    $location.url( MenuState.getNextURI() );
                };

                // This was added after all of the work to sniff out whether a
                // child to this element has a prevURI and nextURI element.
                // While it works, ng-view must complete its animation before
                // the prev and next elements are appropriately handled here.
                // This specifically looks for a slug and sets a class that
                // determines how sequential navigational elements should
                // display in the meantime. It assumes any element that's a
                // child of this one will have a slug value of some sort to
                // distinguish between elements in the sequence.
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
