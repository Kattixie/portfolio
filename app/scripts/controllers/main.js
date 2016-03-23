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
    .controller('MainCtrl', function ($scope, Entry, PageState, MenuState)
    {
        $scope.data = {};
        $scope.data.entries = null;

        PageState.setTitle();

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        Entry
            .getAll()
            .then( function(data)
            {
                $scope.data.entries = data;
            });
    });
