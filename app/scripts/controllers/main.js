'use strict';

/**
 * @ngdoc function
 * @name portfolio.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the portfolio.
 */
angular
    .module('portfolio')
    .controller('MainCtrl', function ($log, $scope, Entry, PageState, MenuState)
    {
        var vm = $scope;

        vm.data = {};
        vm.data.entries = null;

        PageState.setTitle();

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        Entry
            .getAll()
            .then( function(data)
            {
                vm.data.entries = data;
            });
    });
