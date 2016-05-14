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
        var vm = $scope,
            ctrl = this;

        // Using primitives or a scalar value here is bad practice due to how
        // prototypical inheritance and property shadowing works. I do think I
        // avoided this problem by using setter/getter functions, but it's
        // still good to know how isolate scope is impacted by this:
        //     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
        //     http://embed.plnkr.co/qRhLfw/preview
        // $scope.entry = null;

        vm.data = {};
        vm.data.entry = null;

        PageState.setLoadingState(false);

        MenuState.isCentered(true);

        Entry
            .getBySlug( $routeParams.slug )
            .then( function(data)
            {
                vm.data.entry = data;

                $log.debug('The entry for %s: %o', $routeParams.slug, vm.data.entry);

                PageState.setTitle( vm.data.entry.title );

                MenuState.setPrevURI( vm.data.entry.prevSlug || '/' );
                MenuState.setNextURI( vm.data.entry.nextSlug || '/' );

                ctrl.setIframes();
                ctrl.setLinks();
            });

        ctrl.setIframes = function()
        {
            if ( vm.data.entry.images )
            {
                for ( var i = 0; i < vm.data.entry.images.length; i++)
                {
                    // $log.debug('Is the path an instance of String? %s', vm.data.entry.images[i].path instanceof String );
                    // $log.debug('Is the path type string? %s', typeof vm.data.entry.images[i].path === 'string');

                    if ( vm.data.entry.images[i].type === 'vimeo' && typeof vm.data.entry.images[i].path === 'string' )
                    {
                        vm.data.entry.images[i].path = $sce.trustAsResourceUrl( vm.data.entry.images[i].path );
                    }
                }
            }
        };

        ctrl.setLinks = function()
        {
            if ( vm.data.entry.urls )
            {
                for ( var i = 0; i < vm.data.entry.urls.length; i++)
                {
                    // It is possible to have the links set twice if the user
                    //  visits the same entry more than once.
                    if ( typeof vm.data.entry.urls[i].path === 'string' )
                    {
                        vm.data.entry.urls[i].path = $sce.trustAsResourceUrl( vm.data.entry.urls[i].path );
                    }
                }
            }
        };
    });
