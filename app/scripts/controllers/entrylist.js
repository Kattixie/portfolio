'use strict';

/**
 * @ngdoc function
 * @name portfolio.controller:EntryListCtrl
 * @description
 * # EntryListCtrl
 * Controller of the portfolio
 */
angular
    .module('portfolio')
    .controller('EntryListCtrl', function ($scope, $log, $routeParams, Entry, PageState, MenuState)
    {
        var vm = $scope,
            ctrl = this;

        vm.data = {};
        vm.data.entries = [];
        vm.data.categories = [];

        vm.state = {};
        vm.state.categoryIsClicked = false;
        vm.state.selectedCategories = [];

        PageState.setTitle();

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        $log.debug('The scope for EntryListCtrl: %o', vm);

        Entry
            .getAll()
            .then( function(data)
            {
                vm.data.entries = data;
                vm.data.categories = Entry.getAllCategories();

                ctrl.setDefaultCategoryState();

                $log.debug('The entries: %o', vm.data.entries);
                $log.debug('The categories: %o', vm.data.categories);
                $log.debug('The selected categories: %o', vm.state.selectedCategories);
            });

        // Todo: I can probably move a lot of this to a custom directive.
        ctrl.setDefaultCategoryState = function()
        {

            var routeCategories = ( $routeParams.categories ) ? $routeParams.categories.split(',').map(Number) : [];

            vm.state.categoryIsClicked = false;

            for ( var i = 0; i < vm.data.categories.length; i++)
            {
                if ( routeCategories.indexOf( vm.data.categories[i].id ) !== -1 )
                {
                    vm.data.categories[i].isSelected = true;
                }
                else
                {
                    vm.data.categories[i].isSelected = null;
                }

                if ( vm.data.categories[i].count > 0 )
                {
                    vm.state.selectedCategories.push( vm.data.categories[i].id );
                }
            }
        };

        ctrl.toggleCategory = function( i )
        {
            if ( ! vm.state.categoryIsClicked )
            {
                vm.state.categoryIsClicked = true;

                vm.state.selectedCategories = [];
            }

            if ( vm.data.categories[i].isSelected === true )
            {
                vm.data.categories[i].isSelected = false;

                var j = vm.state.selectedCategories.indexOf( vm.data.categories[i].id );

                if ( j !== -1 )
                {
                    vm.state.selectedCategories.splice(j, 1);
                }

                if ( vm.state.selectedCategories.length === 0 )
                {
                    ctrl.setDefaultCategoryState();
                }
            }
            else
            {
                vm.data.categories[i].isSelected = true;

                vm.state.selectedCategories.push( vm.data.categories[i].id );
            }
        };

        ctrl.inSelectedCategories = function( i )
        {
            var found = false;

            for ( var j = 0; j < vm.state.selectedCategories.length && ! found; j++ )
            {
                if ( vm.data.entries[i].categoryIds.indexOf( vm.state.selectedCategories[j] ) >= 0 )
                {
                    found = true;
                }
            }

            return found;
        };
    });
