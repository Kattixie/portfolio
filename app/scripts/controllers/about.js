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
        $scope.data = {};
        $scope.data.profile = null;

        PageState.setTitle('About');

        MenuState.setPrevURI(undefined);
        MenuState.setNextURI(undefined);

        About
            .getProfile()
            .then( function(data)
            {
                $scope.data.profile = data;

                $log.debug('The profile data: %o', $scope.data.profile);
            });
    });
