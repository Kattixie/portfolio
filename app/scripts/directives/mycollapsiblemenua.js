'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myCollapsibleMenuA
 * @description
 * # myCollapsibleMenuA
 * Menu style in traditonal drowndown format.
 */
angular
    .module('portfolio')
    .directive('myCollapsibleMenuA', function ($log, $window, $location, $routeParams, $timeout, WindowState, MenuState)
    {
        return {
            restrict: 'E',
            controllerAs: 'nav',
            bindToController: true,
            templateUrl: 'views/primarynav.html',
            controller: function($scope, $element)
            {
                var self = this;

                // Elements

                self.container = $element.find('nav');
                self.dropdownMenu = $element.find('.nav-items');
                self.primaryListItems = self.dropdownMenu.find('ul.nav-primary');
                self.hamburgerIcon = $element.find('#nav-icon');
                self.logo = $element.find('h1#logo');

                MenuState.setHamburgerIcon( self.hamburgerIcon );

                // Values

                self.prevPageYOffset = $window.pageYOffset;
                self.contentPositionY = 0;
                self.positionYCompactUp = undefined;
                self.positionYCompactDown = undefined;
                self.resizeTimeoutId = undefined;
                self.scrollTimeoutId = undefined;

                // Timers

                var _positionTO;

                // $log.debug('The header height element: %o', self.dropdownMenu.find('li').eq(0).height());

                self.init = function()
                {
                    self.setCompactPositions();
                    self.setMenu();
                };

                /* SETUP */

                self.setMenuHeight = function( height )
                {
                    if ( ! height )
                    {
                        var originalProps =
                        {
                            display: self.dropdownMenu.css('display'),
                            visibility: self.dropdownMenu.css('visibility')
                        };

                        // $log.debug('The original properties: %o', originalProps);

                        self.dropdownMenu.css({
                            visibility: 'hidden',
                            display:    'block'
                        });

                        var position = self.dropdownMenu.offset();

                        self.dropdownMenu.css( originalProps );

                        height = WindowState.jqWindow.height() - position.top;
                    }

                    self.dropdownMenu.height( height );

                    // $log.debug('The offset of element %o: %s', self.dropdownMenu, position.top);
                };

                self.setMenu = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        self.setCollapsibleDefaults();
                    }
                    else
                    {
                        self.setHorizontalDefaults();
                    }
                };

                // Establishes default settings/behavior for when menu is in
                // non-collapsible horizontal state on larger screens.
                self.setHorizontalDefaults = function()
                {
                    self.dropdownMenu.show();

                    // self.setMenuHeight('auto');

                    MenuState.isOpen = false;

                    self.container.removeClass( MenuState.collapsedClassName );
                };

                // Establishes default settings/behavior for when menu is in
                // collapsible vertical state on smaller screens.
                self.setCollapsibleDefaults = function()
                {
                    self.dropdownMenu.hide();

                    // Iffy on whether or not this is a behavior I want.
                    // self.setMenuHeight();

                    MenuState.isOpen = false;

                    self.container.addClass( MenuState.collapsedClassName );
                };

                // Determines if the menu should have "centered" state and
                // returns answer.
                self.isCentered = function()
                {
                    // If a slug parameter exists, an entry exists. Assume
                    // centered state.
                    if ( $routeParams.slug )
                    {
                        MenuState.isCentered = true;
                    }
                    else
                    {
                        MenuState.isCentered = false;
                    }

                    return MenuState.isCentered;
                }

                // Sets element classes based on current menu alignment.
                self.setMenuAlignment = function()
                {
                    if ( self.isCentered() )
                    {
                        if ( ! self.container.hasClass( MenuState.centerClassName ) )
                        {
                            self.container.addClass( MenuState.centerClassName );
                        }
                    }
                    else
                    {
                        self.container.removeClass( MenuState.centerClassName );
                    }
                };

                self.setLogo = function()
                {
                    if ( MenuState.isCollapsible() && self.isCentered() )
                    {
                        self.logo.addClass( MenuState.centerClassName );
                    }
                    else
                    {
                        self.logo.removeClass( MenuState.centerClassName );
                    }
                };

                /* ACTIONS */

                self.toggleMenu = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        if ( MenuState.isOpen )
                        {
                            self.closeMenu();
                        }
                        else
                        {
                            self.openMenu();
                        }
                    }
                    else
                    {
                        $location.url('/');
                    }
                };

                self.openMenu = function( duration )
                {
                    if ( ! duration )
                    {
                        duration = 300;
                    }

                    self.primaryListItems.addClass('animating');

                    self.dropdownMenu
                        .velocity('slideDown',
                        {
                            delay:  0,
                            duration: duration,
                            easing: 'easeInBack',
                            complete: function()
                            {
                                self.primaryListItems.removeClass('animating');
                            }
                        });

                    MenuState.isOpen = true;

                    self.container.removeClass( MenuState.collapsedClassName );
                };

                self.closeMenu = function( duration )
                {
                    if ( ! duration )
                    {
                        duration = 300;
                    }

                    self.primaryListItems.addClass('animating');

                    self.dropdownMenu
                        .velocity('slideUp',
                        {
                            delay:  0,
                            duration: duration,
                            easing: 'easeInBack',
                            complete: function()
                            {
                                self.primaryListItems.removeClass('animating');
                            }
                        });

                    MenuState.isOpen = false;

                    self.container.addClass( MenuState.collapsedClassName );
                };

                /* COMPACT SETUP & BEHAVIOR */

                // Retrieves content position, as determined by current
                // sub-view's "my-content-marker" directive. If no marker has
                // been used, a default position is chosen here.
                self.getContentPosition = function()
                {
                    var position = MenuState.getContentPosition();

                    // Use logo height by default if no marker exists for the
                    // current view.
                    if ( ! position )
                    {
                        position = self.logo.outerHeight();
                    }

                    return position;
                };

                // Sets position that menu should go into "compact" state at.
                // Can be modified depending on scroll direction. The best
                // position can be determined by adding the "my-content-marker"
                // directive to sub-view templates.
                self.setCompactPositions = function(position)
                {
                    if ( ! position )
                    {
                        position = self.getContentPosition();
                    }

                    self.contentPositionY = position;

                    $log.debug('The Y position: %s', self.contentPositionY);

                    self.positionYCompactDown = self.contentPositionY;
                    self.positionYCompactUp = self.contentPositionY;
                };

                // This works, but seems like overkill when we can less
                // frequently rely on scroll/resize behavior to check for the
                // position.
                self.onPositionTO = function()
                {
                    _positionTO = null;

                    var position = self.getContentPosition();

                    if (self.contentPositionY !== position)
                    {
                        $log.debug('The position has changed.');

                        $scope.$apply(function()
                        {
                            self.setCompactPositions(position);
                        });
                    }
                };

                self.setCompactMenu = function()
                {
                    var position = ( $window.pageYOffset >= self.prevPageYOffset ) ? self.positionYCompactDown : self.positionYCompactUp;

                    // $log.debug('Compared current offset (%s) to prev offset (%s): ', $window.pageYOffset, self.prevPageYOffset);
                    $log.debug('The position to go compact is: %s', position);

                    if ( $window.pageYOffset > position )
                    {
                        if ( ! self.container.hasClass( MenuState.compactClassName ) )
                        {
                            self.container.addClass( MenuState.compactClassName );

                            MenuState.isCompact = true;

                            //self.setMenuHeight();
                        }
                    }
                    else
                    {
                        if ( self.container.hasClass( MenuState.compactClassName ) )
                        {
                            self.container.removeClass( MenuState.compactClassName );

                            MenuState.isCompact = false;
                        }
                    }
                };

                /* GALLERY MODE STATE */

                self.updateGalleryMode = function( mode, callbackURI )
                {
                    MenuState.selectedGalleryMode = mode;

                    if ( callbackURI )
                    {
                        $location.url( callbackURI );
                    }
                };

                self.isSelectedGalleryMode = function( mode )
                {
                    return MenuState.selectedGalleryMode === mode;
                };

                /* EVENT HANDLERS */

                self.onWindowResize = function()
                {
                    self.setCompactPositions();
                    self.setMenu();
                    self.setMenuAlignment();
                    self.setLogo();

                    if ( MenuState.isCollapsible() )
                    {
                        self.setCompactMenu();
                    }
                    // Currently, the menu is only compacted if it's also
                    // collapsible.
                    else
                    {
                        self.container.removeClass( MenuState.compactClassName );

                        MenuState.isCompact = false;
                    }
                };

                self.onWindowScroll = function()
                {
                    self.setCompactPositions();

                    if ( MenuState.isCollapsible() )
                    {
                        self.setCompactMenu();
                    }
                    // Currently, the menu is only compacted if it's also collapsable.
                    else
                    {
                        self.container.removeClass( MenuState.compactClassName );

                        MenuState.isCompact = false;
                    }

                    self.prevPageYOffset = $window.pageYOffset;
                };

                // Really nice solution borrowed from: http://stackoverflow.com/a/22854824
                self.onRouteChange = function()
                {
                    // self.setCompactPositions();
                    self.setMenuAlignment();
                    self.setLogo();

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

                self.onNavItemClick = function()
                {
                    if ( MenuState.isOpen && MenuState.isCollapsible() )
                    {
                        self.closeMenu( 100 );
                    }
                };

                self.onDestroy = function()
                {
                    WindowState.destroyResize( self.resizeTimeoutId, 'primarynav' );
                    WindowState.destroyScroll( self.scrollTimeoutId, 'primarynav' );

                    $timeout.cancel( _positionTO );
                };

                self.init();

                self.resizeTimeoutId = WindowState.onResize(self.onWindowResize, 'primarynav', 100);
                self.scrollTimeoutId = WindowState.onScroll(self.onWindowScroll, 'primarynav', 300);

                $scope.$on('$routeChangeSuccess', self.onRouteChange);
                $scope.$on('$destroy', self.onDestroy);

                /*
                $scope.$watch(function()
                {
                    if ( ! _positionTO )
                    {
                        _positionTO = $timeout(self.onPositionTO, 50);
                    }
                });
                */

                self.dropdownMenu.find('a').on('click', self.onNavItemClick);
            }
        };
    });
