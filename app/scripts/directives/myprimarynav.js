'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myPrimaryNav
 * @description
 * # myPrimaryNav
 */
angular
    .module('portfolio')
    .directive('myPrimaryNav', function ($log, $window, $location, $routeParams, MenuState)
    {
        return {
            restrict: 'E',
            controllerAs: 'nav',
            bindToController: true,
            templateUrl: 'views/primarynav.html',
            // Use controller when you want to expose an API to other
            // directives. Otherwise, link is appropriate. Actually, it sounds
            // like Angular2 will be encouraging all code that would live in
            // compile/link/controller to live in directive controllers:
            //
            // http://juristr.com/blog/2015/07/learning-ng-prepare-ng2/
            controller: function($scope, $element)
            {
                var self = this;

                // Elements

                self.eWindow = angular.element( $window );
                self.container = $element.find('nav');
                self.dropdownMenu = $element.find('.nav-items');
                self.primaryListItems = self.dropdownMenu.find('ul.nav-primary');
                self.hamburgerIcon = $element.find('#nav-icon');
                self.logo = $element.find('h1#logo');

                MenuState.setHamburgerIcon( self.hamburgerIcon );

                // Values

                self.prevPageYOffset = $window.pageYOffset;
                self.positionYCompactUp = null;
                self.positionYCompactDown = null;

                // $log.debug('The header height element: %o', self.dropdownMenu.find('li').eq(0).height());

                self.setPositions = function()
                {
                    // Header height, which was previously used.
                    //self.positionYCompact = self.dropdownMenu.find('li').eq(0).height();

                    self.positionYCompactDown = self.logo.height() / 2;
                    self.positionYCompactUp = self.logo.height() / 2;
                    //self.positionYCompactUp = self.logo.height() / 2 + Math.abs( parseInt(self.logo.css('margin-top')) );

                    // $log.debug('The Y position: %s', self.positionYCompact);
                };

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

                        height = self.eWindow.height() - position.top;
                    }

                    self.dropdownMenu.height( height );

                    // $log.debug('The offset of element %o: %s', self.dropdownMenu, position.top);
                };

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

                self.setMenu = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        self.dropdownMenu.hide();

                        // Iffy on whether or not this is a behavior I want.
                        // self.setMenuHeight();

                        MenuState.isOpen = false;

                        self.container.addClass( MenuState.collapsedClassName );
                    }
                    else
                    {
                        self.dropdownMenu.show();

                        // self.setMenuHeight('auto');

                        MenuState.isOpen = false;

                        self.container.removeClass( MenuState.collapsedClassName );
                    }
                };

                self.setMenuAlignment = function()
                {
                    if ( $routeParams.slug )
                    {
                        if ( ! self.container.hasClass( MenuState.centerClassName ) )
                        {
                            self.container.addClass( MenuState.centerClassName );

                            MenuState.isCentered = true;
                        }

                    }
                    else
                    {
                        self.container.removeClass( MenuState.centerClassName );

                        MenuState.isCentered = false;
                    }
                };

                self.toggleCompactMenu = function()
                {
                    var position = ( $window.pageYOffset >= self.prevPageYOffset ) ? self.positionYCompactDown : self.positionYCompactUp;

                    // $log.debug('Compared current offset (%s) to prev offset (%s): ', $window.pageYOffset, self.prevPageYOffset);
                    // $log.debug('The position to go compact is: %s', position);

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

                self.setLogo = function()
                {
                    if (MenuState.isCollapsible() && $routeParams.slug)
                    {
                        self.logo.addClass( MenuState.centerClassName );
                    }
                    else
                    {
                        self.logo.removeClass( MenuState.centerClassName );
                    }
                    /*
                    if ( MenuState.isCollapsible() && $routeParams.slug )
                    {
                        self.logo.hide();
                    }
                    else
                    {
                        self.logo.show();
                    }
                    */
                };

                // Event Handlers

                self.onWindowResize = function()
                {
                    self.setPositions();
                    self.setMenu();
                    self.setMenuAlignment();
                    self.setLogo();

                    if ( MenuState.isCollapsible() )
                    {
                        self.toggleCompactMenu();
                    }
                    // Currently, the menu is only compacted if it's also collapsable.
                    else
                    {
                        self.container.removeClass( MenuState.compactClassName );

                        MenuState.isCompact = false;
                    }
                };

                self.onWindowScroll = function()
                {
                    if ( MenuState.isCollapsible() )
                    {
                        self.toggleCompactMenu();
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

                self.setPositions();
                self.setMenu();

                $scope.$on('$routeChangeSuccess', self.onRouteChange);

                self.dropdownMenu.find('a').on('click', self.onNavItemClick);

                self.eWindow.bind('scroll', self.onWindowScroll);
                self.eWindow.bind('resize', self.onWindowResize);
            }
        };
    });
