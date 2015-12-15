'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:mySrc
 * @description
 * # mySrc
 */
angular
    .module('portfolio')
    .directive('mySrc', function ($log, $window, $compile)
    {
        var directiveDefinitionObject =
        {
            restrict: 'A',
            scope: true,
            /*
            This works and could be handy at some point. Note that iElement
            is for instance element and tElement is for template element.
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

                var eWindow = angular.element( $window );
                var element = angular.element( iElement );

                self.init = function()
                {
                    // Bug happens here on first load.
                    self.loadElementInViewport();
                };

                // Definitely want to find a better way to test if this element
                // has been compiled through the $compile service. I had a lot
                // of trouble figuring out the mechanics of this.
                self.isCompiled = function()
                {
                    var tagName = iElement.prop('tagName');

                    if ( tagName )
                    {
                        tagName = tagName.toLowerCase();
                    }

                    return tagName !== 'img';
                };

                self.loadElementInViewport = function()
                {
                    if ( ! self.isCompiled() )
                    {
                        var offset = element.offset();

                        if ( offset.top + element.height() * 0.25 < $window.pageYOffset + eWindow.height() )
                        {
                            scope.$apply( self.compileAsNgSrc );
                        }
                    }
                };

                self.compileAsNgSrc = function()
                {
                    if ( ! self.isCompiled() )
                    {
                        //$log.debug('Compling as ngSrc: %s', iAttrs.mySrc);

                        iElement.attr('ng-src', iAttrs.mySrc);
                        iElement.attr('my-preloader', true);

                        iElement.removeAttr('my-src');

                        //$log.debug('The contents of the element: %s', iElement.prop('outerHTML') );

                        // Use of the $compile service changes iElement. Note
                        // distinctions in use of $compile here (see "Returns"):
                        // https://docs.angularjs.org/api/ng/service/$compile
                        $compile( iElement )(scope);

                        /*
                        var clonedElement = $compile( iElement )( scope, function( clonedElement )
                        {
                            iElement.replaceWith( clonedElement );

                            //iElement.remove();
                            //scope.$destroy();
                        });
                        */
                    }
                };

                self.onWindowScroll = function()
                {
                    self.loadElementInViewport();
                };

                scope.$on('$destroy', function()
                {
                    eWindow.unbind('scroll', self.onWindowScroll);
                });

                eWindow.bind('scroll', self.onWindowScroll);

                self.init();
            }
        };

        return directiveDefinitionObject;
    });
