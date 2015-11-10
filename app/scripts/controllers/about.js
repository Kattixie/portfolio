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
    .controller('AboutCtrl', function ($scope)
    {
        if ( $scope.$parent.$parent )
        {
            $scope.$parent.$parent.setNextURI( null );
            $scope.$parent.$parent.setPrevURI( null );
        }

        this.awesomeThings =
        [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
