'use strict';

/**
 * @ngdoc function
 * @name portfolio.controller:EntryCtrl
 * @description
 * # EntryCtrl
 * Controller of the portfolio
 */
angular
    .module('portfolio')
    .controller('EntryCtrl', function ($log, $scope, $routeParams, $sce, Entry, PageState, MenuState)
    {
        var self = this;

        $log.debug('EntryCtrl scope: %o, this: %o', $scope, self);

        // Using primitives or a scalar value here is bad practice due to how
        // prototypical inheritance and property shadowing works. I do think I
        // avoided this problem by using setter/getter functions, but it's
        // still good to know how isolate scope is impacted by this:
        //     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
        //     http://embed.plnkr.co/qRhLfw/preview
        // $scope.entry = null;

        $scope.data = {};
        $scope.data.entry = null;

        MenuState.isCentered(true);

        Entry
            .getBySlug( $routeParams.slug )
            .then( function(data)
            {
                $scope.data.entry = data;

                $log.debug('The entry for %s: %o', $routeParams.slug, $scope.data.entry);

                PageState.setTitle( $scope.data.entry.title );

                MenuState.setPrevURI( $scope.data.entry.prevSlug || '/' );
                MenuState.setNextURI( $scope.data.entry.nextSlug || '/' );

                self.setIframes();
                self.setLinks();
            });

        self.setIframes = function()
        {
            if ( $scope.data.entry.images )
            {
                for ( var i = 0; i < $scope.data.entry.images.length; i++)
                {
                    // $log.debug('Is the path an instance of String? %s', $scope.data.entry.images[i].path instanceof String );
                    // $log.debug('Is the path type string? %s', typeof $scope.data.entry.images[i].path === 'string');

                    if ( $scope.data.entry.images[i].type === 'vimeo' && typeof $scope.data.entry.images[i].path === 'string' )
                    {
                        $scope.data.entry.images[i].path = $sce.trustAsResourceUrl( $scope.data.entry.images[i].path );
                    }
                }
            }
        };

        self.setLinks = function()
        {
            if ( $scope.data.entry.urls )
            {
                for ( var i = 0; i < $scope.data.entry.urls.length; i++)
                {
                    // It is possible to have the links set twice if the user
                    //  visits the same entry more than once.
                    if ( typeof $scope.data.entry.urls[i].path === 'string' )
                    {
                        $scope.data.entry.urls[i].path = $sce.trustAsResourceUrl( $scope.data.entry.urls[i].path );
                    }
                }
            }
        };
    });
