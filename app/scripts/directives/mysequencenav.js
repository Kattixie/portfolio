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
            // Let's talk about this scope: true value. This property
            // establishes new child scope for this directive. It has the
            // potential to break anything that relies on this directive being
            // part of a broader scope. We can't refer to methods in this
            // controller through $scope.methodName anymore. Instead we must use
            // $scope.$parent syntax. Also note that scope: {...}
            // would create "isolate" scope that does not prototypically
            // inherit.
            scope: true,
            // bindToController: true,
            transclude: true, // This also creates new scope. Why didn't it break $scope.methodName calls?
            templateUrl: 'views/sequencenav.html',
            controller: function($scope, $element)
            {
                var ctrl = this;

                ctrl.container = $element.find('nav');

                $scope.paths =
                {
                    prevURI:    null,
                    nextURI:    null,
                    closeURI:   null
                };

                $scope.setPrevURI = function( prevURI )
                {
                    $log.debug('Updating prev URI to: %s', prevURI);

                    $scope.paths.prevURI = prevURI;
                };

                $scope.setNextURI = function( nextURI )
                {
                    $log.debug('Updating next URI to: %s', nextURI);

                    $scope.paths.nextURI = nextURI;
                };

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
                    return $scope.paths.prevURI;
                };

                ctrl.nextExists = function()
                {
                    return $scope.paths.nextURI;
                };

                // Event Handlers

                ctrl.onNext = function()
                {
                    $location.url( $scope.paths.nextURI );
                };

                ctrl.onPrev = function()
                {
                    $location.url( $scope.paths.prevURI );
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
