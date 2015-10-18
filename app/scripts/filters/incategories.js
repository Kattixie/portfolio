'use strict';

/**
 * @ngdoc filter
 * @name portfolio.filter:inCategories
 * @function
 * @description
 * # inCategories
 * This filter accepts an entries array and categoryIds array and determines if
 * the entries are in the designated categories. It returns a new array of
 * filtered entries. While this works, keep in mind that using it will replace
 * the entire existing array of entries, which won't allow you to animate only
 * the entries that are or are not part of the set anymore.
 */
angular
    .module('portfolio')
    .filter('inCategories', function ()
    {
        return function( entries, categoryIds )
        {
            var filtered = [];

            for ( var i = 0; i < entries.length; i++)
            {
                var entryPushed = false;

                for ( var j = 0; j < categoryIds.length && ! entryPushed; j++)
                {
                    if ( entries[i].categoryIds.indexOf( categoryIds[j] ) >= 0 )
                    {
                        filtered.push( entries[i] );

                        entryPushed = true;
                    }
                }
            }

            return filtered;
        };
    });
