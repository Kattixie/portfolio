'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myCategory
 * @description
 * # myCategory
 */
angular
    .module('portfolio')
    .directive('myCategory', function ($log, $routeParams)
    {
        return {
            restrict: 'E',
            require: '^myCategorizedList',
            scope:
            {
                id: '=',
                name: '=',
                count: '='
            },
            templateUrl: 'views/category.html',
            // Have to use link function in order to access parent controller.
            link: function(scope, iElement, iAttrs, listCtrl)
            {
                var vm = scope;

                var _isSelected = false;

                vm.isSelected = function()
                {
                    // $log.debug('myCategory', 'Determining if category should be selected: %s', vm.name);

                    return _isSelected;
                };

                vm.toggleSelected = function()
                {
                    $log.debug('myCategory', 'Toggling category');

                    if ( _isSelected )
                    {
                        listCtrl.removeSelectedCategory(vm.id);

                        _isSelected = false;
                    }
                    else
                    {
                        listCtrl.addSelectedCategory(vm.id);

                        _isSelected = true;
                    }
                };

                vm.isFaded = function()
                {
                    // $log.debug('myCategory', 'Determining if category should be faded: %s', vm.name);

                    return ! _isSelected && listCtrl.getNumSelectedCategories() > 0;
                }
            }
        };
    });
