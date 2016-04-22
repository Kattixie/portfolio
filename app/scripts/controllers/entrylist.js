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

        PageState.setTitle();

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        Entry
            .getAll()
            .then( function(data)
            {
                vm.data.entries = data;
                vm.data.categories = Entry.getAllCategories();
            });
    });
