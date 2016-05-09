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

                var _elements =
                {
                    container: $element.find('nav'),
                    hamburgerIcon: $element.find('#expand-icon'),
                    closeIcon: $element.find('#collapse-icon'),
                    logo: $element.find('h1#logo'),
                    iconContainer: $element.find('.nav-icon-wrapper'),
                    dropdownMenu: $element.find('.nav-items.collapsible-chained-items'),
                    items: $element.find('ul.nav-primary li.gallery, ul.nav-primary li.list, ul.nav-sub li')
                };

                var _timeoutIds =
                {
                    resize: undefined,
                    scroll: undefined
                };

                var _positionTO;

                // var _defaults =
                // {
                //     dropdownBottom: undefined,
                //     dropdownHeight: undefined,
                //     compact:
                //     {
                //         dropdownBottom: undefined,
                //         dropdownHeight: undefined
                //     }
                // };

                 var _init = function()
                {
                    MenuState.setExpandIcon( _elements.hamburgerIcon );
                    MenuState.setCollapseIcon( _elements.closeIcon );

                    _setMenuStateElements();

                    ctrl.reset();
                };

                ctrl.reset = function()
                {
                    ctrl.setMenuDefaults();
                    ctrl.setContentPosition();
                    ctrl.setMenuAlignment();
                };

                /* ONE-TIME SETUP */

                var _setMenuStateElements = function()
                {
                    // MenuState.addCollapsibleElement( _elements.container );
                    MenuState.addCollapsibleElement( _elements.dropdownMenu );

                    MenuState.addCenterableElement( _elements.container );
                    MenuState.addCenterableElement( _elements.logo );

                    MenuState.addCompactibleElement( _elements.container );

                    MenuState.addScrollbarPaddedElement( _elements.iconContainer );
                };

                // var _setDropdownDefaultProps = function()
                // {
                //     if ( MenuState.isCompacted() )
                //     {
                //         if ( _defaults.compact.dropdownBottom === undefined )
                //         {
                //             _defaults.compact.dropdownBottom = parseInt(_elements.dropdownMenu.css('bottom'));
                //         }
                //
                //         if ( _defaults.compact.dropdownHeight === undefined )
                //         {
                //             _defaults.compact.dropdownHeight = _elements.dropdownMenu.innerHeight();
                //         }
                //     }
                //     else
                //     {
                //         if ( _defaults.dropdownBottom === undefined )
                //         {
                //             _defaults.dropdownBottom = parseInt(_elements.dropdownMenu.css('bottom'));
                //         }
                //
                //         if ( _defaults.dropdownHeight === undefined )
                //         {
                //             _defaults.dropdownHeight = _elements.dropdownMenu.innerHeight();
                //         }
                //     }
                // };

                /* MANY-TIME SETUP */

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

                    // ctrl.setDropdownPositionDefault();
                };

                ctrl.unsetInlineStyles = function()
                {
                    _elements.dropdownMenu.css('bottom', '');
                    _elements.dropdownMenu.css('height', '');
                };

                // Establishes default settings/behavior for when menu is in
                // non-collapsible horizontal state on larger screens.
                ctrl.setHorizontalDefaults = function()
                {
                    ctrl.setMenuScrollbar(false);

                    _setDropdownAnimationData();

                    // This is kind of counter-intuitive, because this flag
                    // doesn't actually matter to this view. However, should the
                    // window get resized, this guarantees no position or
                    // animation changes will occur if the resize triggers
                    // a collapsible view.
                    MenuState.setCollapsed(true);
                    MenuState.setCompacted(false);
                };

                // Establishes default settings/behavior for when menu is in
                // collapsible vertical state on smaller screens.
                ctrl.setCollapsibleDefaults = function()
                {
                    ctrl.setMenuScrollbar(false);

                    _setDropdownAnimationData();

                    if (MenuState.collapsedIsSet())
                    {
                        MenuState.setCollapsed(true);
                    }
                    else
                    {
                        // Designate that this is a first request, and we
                        // don't want animation.
                        MenuState.setCollapsed(true, false);
                    }


                    MenuState.setCompacted(false);

                    // For some reason, ngAnimate fails to sync with
                    // the .collapsible-hidden-items animation if it's
                    // called too soon. I'm not sure how to verify that this
                    // is ready to go? Didn't have this problem in other
                    // test scenarios on CodePen, but they were much smaller
                    // apps.
                    /*
                    $timeout(function()
                    {
                        MenuState.setCollapsed(true);

                    }, 1000);
                    */

                    // _setDropdownDefaultProps();
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

                ctrl.setMenuScrollbar = function(requiresMenuScrollbar)
                {
                    if (requiresMenuScrollbar === undefined)
                    {
                        var height = _elements.dropdownMenu.outerHeight(),
                            windowHeight = WindowState.getHeight();

                        // Is the dropdown height larger than the window
                        // height? If so, set some constraints.
                        requiresMenuScrollbar = ( height >= windowHeight );
                    }

                    if (requiresMenuScrollbar)
                    {
                        ctrl.addMenuScrollbar();
                    }
                    else {
                        ctrl.removeMenuScrollbar();
                    }

                    return requiresMenuScrollbar;
                };

                ctrl.addMenuScrollbar = function()
                {
                    _elements.container.addClass(MenuState.scrollableClassName);

                    MenuState.setScrollbarPadded(true);

                    _elements.dropdownMenu.scrollTop(0);

                    WindowState.hideScrollbar();
                };

                ctrl.removeMenuScrollbar = function()
                {
                    _elements.container.removeClass(MenuState.scrollableClassName);

                    MenuState.setScrollbarPadded(false);

                    WindowState.showScrollbar();
                };

                var _setDropdownAnimationData = function(hasScrollbar)
                {
                    // _setDropdownDefaultProps();

                    // var defaultBottom,
                    //     defaultHeight;

                    // if ( MenuState.isCompacted() )
                    // {
                    //     defaultBottom = _defaults.compact.dropdownBottom;
                    //     defaultHeight = _defaults.compact.dropdownHeight;
                    // }
                    // else
                    // {
                    //     defaultBottom = _defaults.dropdownBottom;
                    //     defaultHeight = _defaults.dropdownHeight;
                    // }

                    // When the bottom position is set to 0, it aligns to the
                    // bottom of the icon wrapper.
                    var bottoms =
                    {
                        // collapsed: defaultBottom
                        collapsed: ''
                    };

                    var heights =
                    {
                        // collapsed: defaultHeight
                        collapsed: ''
                    };

                    if (hasScrollbar)
                    {
                        var windowHeight = WindowState.getHeight();

                        bottoms.expanded = -1 * windowHeight + MenuState.getIconHeight();
                        heights.expanded = windowHeight;
                    }
                    else
                    {
                        var height = _elements.dropdownMenu.outerHeight();

                        bottoms.expanded = -1 * height + MenuState.getIconHeight();
                        // heights.expanded = defaultHeight;
                        heights.expanded = '';
                    }

                    // Set this data for use with animation.
                    _elements.dropdownMenu.data(
                    {
                        bottoms: bottoms,
                        heights: heights,
                        items: _elements.items
                    });
                };

                ctrl.isExpanded = function()
                {
                    return ! MenuState.isCollapsed();
                };

                ctrl.isCollapsed = function()
                {
                    return MenuState.isCollapsed();
                };

                /* ACTIONS */

                ctrl.toggleMenu = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        if ( MenuState.isCollapsed() )
                        {
                            ctrl.expandMenu();
                        }
                        else
                        {
                            ctrl.collapseMenu();
                        }
                    }
                    else
                    {
                        $location.url('/');
                    }
                };

                ctrl.expandMenu = function()
                {
                    // May need a scrollbar, so let this function decide.
                    var hasScrollbar = ctrl.setMenuScrollbar();

                    _setDropdownAnimationData(hasScrollbar);

                    MenuState.setCollapsed(false);
                };

                ctrl.collapseMenu = function()
                {
                    // Won't ever need a scrollbar, so we'll force none.
                    ctrl.setMenuScrollbar(false);

                    _setDropdownAnimationData();

                    MenuState.setCollapsed(true);
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
                        MenuState.setContentPosition( _elements.logo, 1.00 );
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

                    var changed;

                    if ( isFinite(position) && WindowState.hasScrolledTo( position ) )
                    {
                        // $log.debug('myCollapsibleMenuC', 'Setting compacted!');

                        changed = MenuState.setCompacted(true);
                    }
                    else
                    {
                        changed = MenuState.setCompacted(false);
                    }

                    /*
                    if (changed)
                    {
                        ctrl.unsetInlineStyles();
                    }
                    */
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

                /* NAV ITEMS */

                // Really nice solution borrowed from:
                // http://stackoverflow.com/a/22854824
                ctrl.setActiveNavItemClass = function()
                {
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
                        MenuState.setAnimated(false);

                        ctrl.collapseMenu();
                    }
                };

                /* EVENT HANDLERS */

                var _onWindowResize = function()
                {
                    // MenuState.setAnimated(false);

                    ctrl.reset();

                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();
                    }
                };

                var _onWindowScroll = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        ctrl.setCompactedState();

                        if ( ! MenuState.isCollapsed() )
                        {
                            ctrl.collapseMenu();
                        }
                    }
                    // Currently, the menu is only compacted if it's also collapsible.
                    else
                    {
                        MenuState.setCompacted(false);
                    }
                };

                var _onRouteChangeStart = function()
                {
                    // $log.debug('myCollapsibleMenuC', 'Route change is starting. Resetting the content position.');

                    MenuState.resetContentPosition();

                    // Important to set to default state since content positions
                    // are going to get re-calculated.
                    // ctrl.setCompactedDefaults();
                    ctrl.setMenuDefaults();
                };


                var _onRouteChangeSuccess = function()
                {
                    // MenuState.setAnimated(true);

                    ctrl.setMenuAlignment();

                    // This gets invoked too soon. We need to wait and see if
                    // there's a content marker in the view.
                    // ctrl.setCompactedState();

                    ctrl.setActiveNavItemClass();
                };

                var _onDestroy = function()
                {
                    _unsetEventListeners();

                    $timeout.cancel( _positionTO );
                };

                var _unsetEventListeners = function()
                {
                    WindowState.destroyResize( _timeoutIds.resize, 'primarynav' );
                    WindowState.destroyScroll( _timeoutIds.scroll, 'primarynav' );
                };

                var _setEventListeners = function()
                {
                    _timeoutIds.resize = WindowState.onResize(_onWindowResize, 'primarynav', 10);
                    _timeoutIds.scroll = WindowState.onScroll(_onWindowScroll, 'primarynav', 10);

                    // Is the more Angular way to set ng-click in view?
                    // _elements.dropdownMenu.find('a').on('click', ctrl.onNavItemClick);
                };

                _setEventListeners();
                _init();

                $scope.$on('$routeChangeStart', _onRouteChangeStart);
                $scope.$on('$routeChangeSuccess', _onRouteChangeSuccess);
                $scope.$on('$destroy', _onDestroy);

                // This timeout exists only because there's some kind of problem
                // between ngAnimate and the .collapsible-hidden-items
                // animation. If invoked too soon, ngAnimate won't even Load
                // the animation block?
                // $timeout(function()
                // {
                //     _init();
                // }, 1000);

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
