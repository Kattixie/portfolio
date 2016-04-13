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

                    ctrl.setMenuStateElements();
                    ctrl.reset();
                };

                ctrl.reset = function()
                {
                    ctrl.setMenuDefaults();
                    ctrl.setContentPosition();
                    ctrl.setMenuAlignment();
                };

                /* SETUP */

                ctrl.setMenuStateElements = function()
                {
                    MenuState.addCollapsibleElement( ctrl.container );

                    MenuState.addCenterableElement( ctrl.container );
                    MenuState.addCenterableElement( ctrl.logo );

                    MenuState.addCompactibleElement( ctrl.container );
                };

                ctrl.setMenuDefaults = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCollapsibleDefaults();
                    }
                    else
                    {
                        ctrl.setHorizontalDefaults();
                    }

                    ctrl.setAlignmentDefaults();
                    ctrl.setDropdownPositionDefault();
                };

                // Establishes default settings/behavior for when menu is in
                // non-collapsible horizontal state on larger screens.
                ctrl.setHorizontalDefaults = function()
                {
                    MenuState.setCollapsed(false);
                    MenuState.setCompacted(false);
                };

                // Establishes default settings/behavior for when menu is in
                // collapsible vertical state on smaller screens.
                ctrl.setCollapsibleDefaults = function()
                {
                    MenuState.setCollapsed(true);
                    MenuState.setCompacted(false);
                };

                ctrl.setAlignmentDefaults = function()
                {
                    MenuState.setCentered(false);
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

                // Couldn't find a sane way to do this in the CSS file.
                ctrl.setDropdownPositionOpen = function()
                {
                    var height = ctrl.dropdownMenu.outerHeight();

                    ctrl.dropdownMenu.css('bottom', -1 * height + MenuState.getIconHeight() );
                };

                // Default bottom positions should be set in the CSS files.
                // Unset inline styling here.
                ctrl.setDropdownPositionDefault = function()
                {
                    ctrl.dropdownMenu.css('bottom', '' );
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

                ctrl.openMenu = function()
                {
                    MenuState.setCollapsed(false);

                    ctrl.setDropdownPositionOpen();
                };

                ctrl.closeMenu = function()
                {
                    MenuState.setCollapsed(true);

                    ctrl.setDropdownPositionDefault();
                };

                /* COMPACT SETUP & BEHAVIOR */

                // Sets position that menu should go into "compact" state at.
                // The best position can be determined by adding the
                // "my-content-marker" directive to sub-view template elements.
                ctrl.setContentPosition = function()
                {
                    // var prevPosition = MenuState.getContentPosition();

                    if ( ! MenuState.getContentPosition() )
                    {
                        // Use logo height by default if no marker exists for the
                        // current view.
                        MenuState.setContentPosition( ctrl.logo, 1.00 );
                    }

                    // $log.debug('myCollapsibleMenuC', 'The content position, set from this directive: %s -> %s', prevPosition, MenuState.getContentPosition());
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
                    var position = MenuState.getContentPosition();

                    if ( position === undefined )
                    {
                        // Use this directive's defaults to determine a content
                        // position in the absence of a my-content-marker
                        // attribute in the view.
                        ctrl.setContentPosition();

                        position = MenuState.getContentPosition();
                    }

                    // $log.debug('myCollapsibleMenuC', 'The position, as determined in setCompactedState: %s', position);

                    if ( isFinite(position) && WindowState.hasScrolledTo( position ) )
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

                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();
                    }
                };

                ctrl.onWindowScroll = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();

                        if ( ! MenuState.isCollapsed() )
                        {
                            ctrl.closeMenu();
                        }
                    }
                    // Currently, the menu is only compacted if it's also collapsible.
                    else
                    {
                        MenuState.setCompacted(false);
                    }
                };

                ctrl.onRouteChangeStart = function()
                {
                    // $log.debug('myCollapsibleMenuC', 'Route change is starting. Resetting the content position.');

                    MenuState.resetContentPosition();

                    // Important to set to default state since content positions
                    // are going to get re-calculated.
                    ctrl.setCompactedDefaults();
                };

                // Really nice solution borrowed from:
                // http://stackoverflow.com/a/22854824
                ctrl.onRouteChangeSuccess = function()
                {
                    ctrl.setMenuAlignment();

                    // This gets invoked too soon. We need to wait and see if
                    // there's a content marker in the view.
                    // ctrl.setCompactedState();

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
                        ctrl.closeMenu();
                    }
                };

                ctrl.onDestroy = function()
                {
                    ctrl.unsetEventListeners();

                    $timeout.cancel( _positionTO );
                };

                ctrl.unsetEventListeners = function()
                {
                    WindowState.destroyResize( ctrl.resizeTimeoutId, 'primarynav' );
                    WindowState.destroyScroll( ctrl.scrollTimeoutId, 'primarynav' );
                }

                ctrl.setEventListeners = function()
                {
                    ctrl.resizeTimeoutId = WindowState.onResize(ctrl.onWindowResize, 'primarynav', 10);
                    ctrl.scrollTimeoutId = WindowState.onScroll(ctrl.onWindowScroll, 'primarynav', 10);

                    // Is the more Angular way to set ng-click in view?
                    // ctrl.dropdownMenu.find('a').on('click', ctrl.onNavItemClick);
                };

                ctrl.init();
                ctrl.setEventListeners();

                $scope.$on('$routeChangeStart', ctrl.onRouteChangeStart);
                $scope.$on('$routeChangeSuccess', ctrl.onRouteChangeSuccess);
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
            }
        };
    });
