'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myCollapsibleMenuC
 * @description
 * # myCollapsibleMenuC
 * Menu style in traditonal dropdown format.
 */
angular
    .module('portfolio')
    .directive('myCollapsibleMenuC', function ($log, $window, $location, $routeParams, $timeout, WindowState, MenuState)
    {
        return {
            restrict: 'E',
            controllerAs: 'nav',
            bindToController: true,
            templateUrl: 'views/primarynav.html',
            controller: function($scope, $element)
            {
                var ctrl = this;

                // Elements

                ctrl.container = $element.find('nav');
                ctrl.dropdownMenu = $element.find('.nav-items');
                ctrl.primaryListItems = ctrl.dropdownMenu.find('ul.nav-primary');
                ctrl.hamburgerIcon = $element.find('#nav-icon');
                ctrl.logo = $element.find('h1#logo');

                // Values

                ctrl.resizeTimeoutId = undefined;
                ctrl.scrollTimeoutId = undefined;

                // Timers

                var _positionTO;

                ctrl.init = function()
                {
                    MenuState.setIcon( ctrl.hamburgerIcon );

                    ctrl.reset();
                };

                ctrl.reset = function()
                {
                    ctrl.setContentPosition();
                    ctrl.setMenuDefaults();
                };

                /* SETUP */

                ctrl.setMenuDefaults = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCollapsibleDefaults();
                        ctrl.setCompactedDefaults();
                    }
                    else
                    {
                        ctrl.setHorizontalDefaults();
                    }

                    ctrl.setAlignmentDefaults();
                };

                // Establishes default settings/behavior for when menu is in
                // non-collapsible horizontal state on larger screens.
                ctrl.setHorizontalDefaults = function()
                {
                    // ctrl.dropdownMenu.show();

                    MenuState.setCollapsed(false);
                };

                // Establishes default settings/behavior for when menu is in
                // collapsible vertical state on smaller screens.
                ctrl.setCollapsibleDefaults = function()
                {
                    // ctrl.dropdownMenu.hide();

                    MenuState.addCollapsibleElement( ctrl.container );

                    // Originally set to false <---
                    MenuState.setCollapsed(true);
                };

                ctrl.setAlignmentDefaults = function()
                {
                    MenuState.addCenterableElement( ctrl.container );
                    MenuState.addCenterableElement( ctrl.logo );

                    MenuState.isCentered(false);
                };

                ctrl.setCompactedDefaults = function()
                {
                    MenuState.addCompactibleElement( ctrl.container );

                    MenuState.setCompacted(false);
                };

                // Determines if the menu should have "centered" state and
                // returns answer.
                ctrl.isCentered = function()
                {
                    // If a slug parameter exists, an entry exists. Assume
                    // centered state.
                    if ( $routeParams.slug )
                    {
                        MenuState.setCentered(true);
                    }
                    else
                    {
                        MenuState.setCentered(false);
                    }

                    return MenuState.isCentered();
                };

                // Sets element classes based on current menu alignment.
                ctrl.setMenuAlignment = function()
                {
                    if ( MenuState.isCollapsible() && ctrl.isCentered() )
                    {
                        MenuState.setCentered(true);
                    }
                    else
                    {
                        MenuState.setCentered(false);
                    }
                };

                /* ACTIONS */

                ctrl.toggleMenu = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        if ( MenuState.isCollapsed() )
                        {
                            ctrl.openMenu();
                        }
                        else
                        {
                            ctrl.closeMenu();
                        }
                    }
                    else
                    {
                        $location.url('/');
                    }
                };

                ctrl.openMenu = function( duration )
                {
                    if ( ! duration )
                    {
                        duration = 300;
                    }

                    ctrl.dropdownMenu.addClass('open');

                    /*
                    ctrl.primaryListItems.addClass('animating');

                    ctrl.dropdownMenu
                        .velocity('slideDown',
                        {
                            delay:  0,
                            duration: duration,
                            easing: 'easeInBack',
                            complete: function()
                            {
                                ctrl.primaryListItems.removeClass('animating');
                            }
                        });
                    */

                    MenuState.setCollapsed(false);
                };

                ctrl.closeMenu = function( duration )
                {
                    if ( ! duration )
                    {
                        duration = 300;
                    }

                    /*
                    ctrl.primaryListItems.addClass('animating');

                    ctrl.dropdownMenu
                        .velocity('slideUp',
                        {
                            delay:  0,
                            duration: duration,
                            easing: 'easeInBack',
                            complete: function()
                            {
                                ctrl.primaryListItems.removeClass('animating');
                            }
                        });

                    */

                    MenuState.setCollapsed(true);
                };

                /* COMPACT SETUP & BEHAVIOR */

                // Sets position that menu should go into "compact" state at.
                // The best position can be determined by adding the
                // "my-content-marker" directive to sub-view template elements.
                ctrl.setContentPosition = function()
                {
                    if ( ! MenuState.getContentPosition() )
                    {
                        // Use logo height by default if no marker exists for the
                        // current view.
                        MenuState.setContentPosition( ctrl.logo, 1.00 );
                    }
                };

                // This works, but seems like overkill when we can less
                // frequently rely on scroll/resize behavior to check for the
                // position.
                ctrl.onPositionTO = function()
                {
                    _positionTO = null;

                    var position = ctrl.getContentPosition();

                    if (ctrl.contentPositionY !== position)
                    {
                        $log.debug('myCollapsibleMenuC', 'The position has changed.');

                        $scope.$apply(function()
                        {
                            ctrl.setContentPosition(position);
                        });
                    }
                };

                ctrl.setCompactedState = function()
                {
                    if ( WindowState.hasScrolledTo( MenuState.getContentPosition() ) )
                    {
                        MenuState.setCompacted(true);
                    }
                    else
                    {
                        MenuState.setCompacted(false);
                    }
                };

                /* GALLERY MODE STATE */

                ctrl.updateGalleryMode = function( mode, callbackURI )
                {
                    MenuState.selectedGalleryMode = mode;

                    if ( callbackURI )
                    {
                        $location.url( callbackURI );
                    }
                };

                ctrl.isSelectedGalleryMode = function( mode )
                {
                    return MenuState.selectedGalleryMode === mode;
                };

                /* EVENT HANDLERS */

                ctrl.onWindowResize = function()
                {
                    ctrl.reset();
                    //ctrl.setContentPosition();
                    //ctrl.setMenuDefaults();
                    ctrl.setMenuAlignment();
                    // ctrl.setLogo();

                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();
                    }
                    // Currently, the menu is only compacted if it's also
                    // collapsible.
                    else
                    {
                        MenuState.setCompacted(false);
                    }
                };

                ctrl.onWindowScroll = function()
                {
                    // ctrl.setContentPosition();

                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();

                        if ( ! MenuState.isCollapsed() )
                        {
                            ctrl.closeMenu( 100 );
                        }
                    }
                    // Currently, the menu is only compacted if it's also collapsible.
                    else
                    {
                        MenuState.setCompacted(false);
                    }
                };

                // Really nice solution borrowed from: http://stackoverflow.com/a/22854824
                ctrl.onRouteChange = function()
                {
                    // ctrl.setCompactPositions();
                    ctrl.setMenuAlignment();
                    // ctrl.setLogo();

                    var hrefs = [
                                    '/#' + $location.path(),
                                    '#' + $location.path(),
                                    $location.path()
                                ];

                    angular.forEach( $element.find('a'), function(a)
                    {
                        // $log.debug('Examining: %s Against: %o', angular.element(a).text().trim(), hrefs );

                        a = angular.element(a);

                        if ( -1 !== hrefs.indexOf( a.attr('href') ))
                        {
                            a.parent().addClass( MenuState.activeClassName );
                        }
                        else
                        {
                            a.parent().removeClass( MenuState.activeClassName );
                        }
                    });
                };

                ctrl.onNavItemClick = function()
                {
                    if ( MenuState.isCollapsible() && ! MenuState.isCollapsed() )
                    {
                        ctrl.closeMenu( 100 );
                    }
                };

                ctrl.onDestroy = function()
                {
                    WindowState.destroyResize( ctrl.resizeTimeoutId, 'primarynav' );
                    WindowState.destroyScroll( ctrl.scrollTimeoutId, 'primarynav' );

                    $timeout.cancel( _positionTO );
                };

                ctrl.init();

                ctrl.resizeTimeoutId = WindowState.onResize(ctrl.onWindowResize, 'primarynav', 10);
                ctrl.scrollTimeoutId = WindowState.onScroll(ctrl.onWindowScroll, 'primarynav', 10);

                $scope.$on('$routeChangeSuccess', ctrl.onRouteChange);
                $scope.$on('$destroy', ctrl.onDestroy);

                /*
                $scope.$watch(function()
                {
                    if ( ! _positionTO )
                    {
                        _positionTO = $timeout(ctrl.onPositionTO, 50);
                    }
                });
                */

                ctrl.dropdownMenu.find('a').on('click', ctrl.onNavItemClick);
            }
        };
    });
