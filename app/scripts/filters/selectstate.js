'use strict';

/**
 * @ngdoc filterSelectState
 * @name portfolio.filter:eitherSelectState
 * @function
 * @description
 * # either
 * Filter in the portfolio.
 */
angular
    .module('portfolio')
    .filter('eitherSelectState', function()
    {
        return function( items, conditionA, conditionB )
        {
            var filtered = [];

            /*
            if ( ! angular.isArray(conditions) || conditions.length !== 2 )
            {
                return filtered;
            }
            */

            angular.forEach(items, function(item)
            {
                if ( item.isSelected === conditionA || item.isSelected === conditionB )
                {
                    //console.log('The item meets both conditions: %o', item);

                    filtered.push(item);
                }
            });

            return filtered;
        };
    });
