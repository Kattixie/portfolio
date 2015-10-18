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
    .controller('MainCtrl', ['$scope', 'Entry',
    function ($scope, Entry)
    {
        $scope.data = {};
        $scope.data.entries = null;

        // Yarrr...
        if ( $scope.$parent.$parent )
        {
            $scope.$parent.$parent.setNextURI( null );
            $scope.$parent.$parent.setPrevURI( null );
        }

        Entry
            .getAll()
            .then( function(data)
            {
                $scope.data.entries = data;
            });
    }]);
