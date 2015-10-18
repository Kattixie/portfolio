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
    .controller('EntryListCtrl', ['$scope', '$log', '$routeParams', 'Entry',
    function ($scope, $log, $routeParams, Entry)
    {
        var self = this;

        $scope.data = {};
        $scope.data.entries = [];
        $scope.data.categories = [];

        $scope.state = {};
        $scope.state.categoryIsClicked = false;
        $scope.state.selectedCategories = [];

        if ( $scope.$parent.$parent )
        {
            $scope.$parent.$parent.setNextURI( null );
            $scope.$parent.$parent.setPrevURI( null );
        }
        
        $log.debug('The scope for EntryListCtrl: %o', $scope);

        Entry
            .getAll()
            .then( function(data)
            {
                $scope.data.entries = data;
                $scope.data.categories = Entry.getAllCategories();

                self.setDefaultCategoryState();

                $log.debug('The entries: %o', $scope.data.entries);
                $log.debug('The categories: %o', $scope.data.categories);
                $log.debug('The selected categories: %o', $scope.state.selectedCategories);
            });

        // Todo: I can probably move a lot of this to a custom directive.
        self.setDefaultCategoryState = function()
        {

            var routeCategories = ( $routeParams.categories ) ? $routeParams.categories.split(',').map(Number) : [];

            $scope.state.categoryIsClicked = false;

            for ( var i = 0; i < $scope.data.categories.length; i++)
            {
                if ( routeCategories.indexOf( $scope.data.categories[i].id ) !== -1 )
                {
                    $scope.data.categories[i].isSelected = true;
                }
                else
                {
                    $scope.data.categories[i].isSelected = null;
                }

                if ( $scope.data.categories[i].count > 0 )
                {
                    $scope.state.selectedCategories.push( $scope.data.categories[i].id );
                }
            }
        };

        self.toggleCategory = function( i )
        {
            if ( ! $scope.state.categoryIsClicked )
            {
                $scope.state.categoryIsClicked = true;

                $scope.state.selectedCategories = [];
            }

            if ( $scope.data.categories[i].isSelected === true )
            {
                $scope.data.categories[i].isSelected = false;

                var j = $scope.state.selectedCategories.indexOf( $scope.data.categories[i].id );

                if ( j !== -1 )
                {
                    $scope.state.selectedCategories.splice(j, 1);
                }

                if ( $scope.state.selectedCategories.length === 0 )
                {
                    self.setDefaultCategoryState();
                }
            }
            else
            {
                $scope.data.categories[i].isSelected = true;

                $scope.state.selectedCategories.push( $scope.data.categories[i].id );
            }
        };

        self.inSelectedCategories = function( i )
        {
            var found = false;

            for ( var j = 0; j < $scope.state.selectedCategories.length && ! found; j++ )
            {
                if ( $scope.data.entries[i].categoryIds.indexOf( $scope.state.selectedCategories[j] ) >= 0 )
                {
                    found = true;
                }
            }

            return found;
        };
    }]);
