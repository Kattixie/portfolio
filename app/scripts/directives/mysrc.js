'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySrc
 * @description
 * # mySrc
 */
angular
    .module('portfolio')
    .directive('mySrc', function ($log, $window, $timeout, $compile)
    {
        var directiveDefinitionObject =
        {
            restrict: 'A',
            scope: true,
            /*
            This works and could be handy at some point. Note that iElement
            is for instance element and tElement is for template element.
            Note that link will not execute if this method exists.
            compile: function(tElement, tAttrs)
            {
                tElement.attr('ng-src', tAttrs.mySrc);
                tElement.attr('my-preloader');

                // Must remove to avoid what I think is an infinite loop.
                tElement.removeAttr('my-src');

                return {

                    post: function(scope, iElement, iAttr)
                    {
                        $compile(iElement)(scope);
                    }
                };
            },
            */
            link: function(scope, iElement, iAttrs)
            {
                var self = {};

                self.eWindow = angular.element( $window );
                self.element = angular.element( iElement );

                scope.isCompiled = false;

                self.init = function()
                {
                    $log.debug('Height observed.');

                    // There ~*MUST*~ be a better way to detect when the image
                    // elements have finished being populated. Without this,
                    // the offset properties are incredibly erroneous because
                    // they are calculated too soon.
                    $timeout( function()
                    {
                        self.loadElementInViewport();
                    }, 400);
                };

                self.isCompiled = function()
                {
                    return scope.isCompiled;

                    /*
                    var tagName = iElement.prop('tagName');

                    if ( tagName )
                    {
                        tagName = tagName.toLowerCase();
                    }

                    return tagName !== 'img';
                    */
                };

                self.loadElementInViewport = function()
                {
                    // $log.debug('Is compiled? [%s]: %s', iAttrs.mySrc, scope.isCompiled);

                    if ( ! self.isCompiled() )
                    {
                        if ( self.inViewport() )
                        {
                            // A safety precaution that prevents $apply from
                            // being invoked when in progress.
                            $timeout( function()
                            {
                                $log.debug('Using scope.$apply');

                                scope.$apply( self.compileAsNgSrc );
                            });
                        }
                    }
                };

                self.compileAsNgSrc = function()
                {
                    if ( ! self.isCompiled() )
                    {
                        iElement.attr('ng-src', iAttrs.mySrc);
                        iElement.attr('my-preloader', true);

                        iElement.removeAttr('my-src');

                        // $log.debug('The contents of the element: %s', element.prop('outerHTML') );

                        // Use of the $compile service changes iElement. Note
                        // distinctions in use of $compile here (see "Returns"):
                        // https://docs.angularjs.org/api/ng/service/$compile
                        $compile( iElement )( scope, function( clonedElement )
                        {
                            iElement.replaceWith( clonedElement );

                            scope.isCompiled = true;
                        });
                    }
                };

                self.inViewport = function()
                {
                    // Oh boy, are there problems with this. The following
                    // behaviors manifest:
                    // 1. On large screens, the top offset is far too large
                    //    as the view changes and new mySrc elements are loaded.
                    //    This might be happening because they are loaded below
                    //    the "exiting" view before it disappears. Note that
                    //    width and height are explicitly set for large screens.
                    // 2. On small screens, the offset is far too small on every
                    //    load. This might be happening because the height is
                    //    set to auto and hasn't been calculated yet.
                    // The best solution I've found is to set a timeout. Ugh.
                    // There must be a better solution.
                    var offset = self.element.offset();

                    $log.debug('The offset top: %o', offset.top);

                    return ( offset.top + self.element.height() * 0.025 < $window.pageYOffset + self.eWindow.height() );
                };

                self.onWindowScroll = function()
                {
                    self.loadElementInViewport();
                };

                self.onWindowResize = function()
                {
                    self.loadElementInViewport();
                };

                // We can get a lot of wasted calls without this listener.
                // It fires whenever a view changes so that this element is
                // no longer displayed.
                self.onDestroy = function()
                {
                    self.eWindow.unbind('scroll', self.onWindowScroll);
                    self.eWindow.unbind('resize', self.onWindowResize);
                };

                self.eWindow.bind('scroll', self.onWindowScroll);
                self.eWindow.bind('resize', self.onWindowResize);

                scope.$on('$destroy', self.onDestroy);

                // This does not solve the problem of $digest being in progress.
                //scope.$evalAsync( self.init );

                //self.init();

                iAttrs.$observe('height', self.init );
            }
        };

        return directiveDefinitionObject;
    });
