'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySequenceNav
 * @description
 * # mySequenceNav
 */
angular
    .module('portfolio')
    .directive('mySequenceNav', ['$log', '$window', '$location', '$routeParams', 'MenuState',
    function ($log, $window, $location, $routeParams, MenuState)
    {
        return {
            restrict: 'E',
            controllerAs: 'sequenceNav',
            // Let's talk about this scope: true value. This property
            // establishes new child scope for this directive. It has the
            // potential to break anything that relies on this directive being
            // part of a broader scope. We can't refer to methods in this
            // controller through $scope.methodName anymore. Instead we use
            // must use $scope.$parent syntax. Also note that scope: {...}
            // would create "isolate" scope that does not prototypically
            // inherit.
            scope: true,
            // bindToController: true,
            transclude: true, // This also creates new scope. Why didn't it break $scope.methodName calls?
            templateUrl: 'views/sequencenav.html',
            controller: function($scope, $element)
            {
                var self = this;

                self.eWindow = angular.element( $window );
                self.container = $element.find('nav');

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

                self.prevExists = function()
                {
                    return $scope.paths.prevURI;
                };

                self.nextExists = function()
                {
                    return $scope.paths.nextURI;
                };

                self.setCompactMenu = function()
                {
                    if ( MenuState.isCompact )
                    {
                        if ( ! self.container.hasClass( MenuState.compactClassName ) )
                        {
                            self.container.addClass( MenuState.compactClassName );
                        }
                    }
                    else
                    {
                        if ( self.container.hasClass( MenuState.compactClassName ) )
                        {
                            self.container.removeClass( MenuState.compactClassName );
                        }
                    }
                };

                // Event Handlers

                self.onNext = function()
                {
                    $location.url( $scope.paths.nextURI );
                };

                self.onPrev = function()
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
                self.onRouteChange = function()
                {
                    if ( $routeParams.slug )
                    {
                        self.container.addClass('sequenced');
                    }
                    else
                    {
                        self.container.removeClass('sequenced');
                    }
                };

                self.onWindowResize = function()
                {
                    self.setCompactMenu();
                };

                self.onWindowScroll = function()
                {
                    self.setCompactMenu();
                };

                $scope.$on('$routeChangeSuccess', self.onRouteChange);

                self.eWindow.bind('scroll', self.onWindowScroll);
            }
        };
    }]);
