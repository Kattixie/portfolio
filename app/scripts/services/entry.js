'use strict';

/**
 * @ngdoc service
 * @name portfolio.data
 * @description
 * # data
 * Factory in the portfolio.
 */
angular
    .module('portfolio')
    .factory('Entry', function ($log, $q, $http)
    {
        var service = {};

        var _entriesURL = 'data/entries.json';

        var _entries = [];

        var _categories = [];

        // For quick look-up of individual entries by slug. Angular needs
        // an array with numeric indices for ng-repeat and filtering, so I'm
        // keeping track of two sets of entries. This one is only used for
        // finding single entries.
        var _entriesDictionary = [];

        service.getBySlug = function( targetSlug )
        {
            var deferred = $q.defer();

            if ( _entriesDictionary[ targetSlug] !== undefined )
            {
                $log.debug('The entry for this slug is stored.');

                deferred.resolve( _entriesDictionary[ targetSlug ] );
            }
            else
            {
                service
                    .getAll()
                    .then( function()
                    {
                        if ( _entriesDictionary[ targetSlug] !== undefined )
                        {
                            deferred.resolve( _entriesDictionary[ targetSlug ] );
                        }
                    });
            }

            return deferred.promise;
        };

        service.getAll = function ()
        {
            var deferred = $q.defer();

            // This isn't required with the cache setting, but I wanted to
            // try it out in case there was a reason to handle stored data
            // manually.
            if ( _entries.length > 0 )
            {
                $log.debug('The stored entries variable was used.');

                deferred.resolve( _entries );
            }
            else
            {
                $http
                    .get( _entriesURL, { cache: true } )
                    .success( function(data)
                    {
                        $log.debug('Entries were retrieved via $http');

                        var categoryIdCount = 1;

                        for (var i = 0; i < data.length; i++)
                        {
                            data[i].prevSlug = ( i > 0 ) ? data[ i - 1 ].slug : null;
                            data[i].nextSlug = ( i < data.length - 1 ) ? data[ i + 1 ].slug : null;

                            _entriesDictionary[ data[i].slug ] = data[i];

                            var categories = data[i].category;
                            var categoryIds = [];

                            // Categories are generated based on what
                            // appears in entry data.
                            for (var j = 0; j < categories.length; j++)
                            {
                                var category = categories[j].toLowerCase();

                                if ( _categories[ category ] === undefined )
                                {
                                    _categories[ category ] =
                                    {
                                        id: categoryIdCount,
                                        slug: category,
                                        name: categories[j],
                                        count: 1
                                    };

                                    categoryIds.push( categoryIdCount );

                                    categoryIdCount++;
                                }
                                else
                                {
                                    _categories[ category ].count = _categories[ category ].count++;

                                    categoryIds.push( _categories[ category ].id );
                                }
                            }

                            data[i].categoryIds = categoryIds;
                        }

                        _entries = data;

                        deferred.resolve( _entries );
                    });
            }

            return deferred.promise;
        };

        service.getAllCategories = function()
        {
            var categories = [];

            for (var key in _categories)
            {
                categories.push( _categories[key] );
            }

            return categories;
        };

        // Public API
        return service;

    });
