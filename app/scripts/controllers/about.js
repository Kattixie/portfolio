'use strict';

/**
 * @ngdoc function
 * @name angularPortfolioApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angularPortfolioApp
 */
angular
    .module('portfolio')
    .controller('AboutCtrl', function ($log, $scope, About, PageState, MenuState)
    {
        var vm = $scope;

        vm.data = {};
        vm.data.profile = null;

        PageState.setTitle('About');

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        About
            .getProfile()
            .then( function(data)
            {
                vm.data.profile = data;

                $log.debug('The profile data: %o', vm.data.profile);
            });
    });
