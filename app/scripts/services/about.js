'use strict';

/**
 * @ngdoc service
 * @name portfolio.about
 * @description
 * # About
 * Factory in the portfolio.
 */
angular
    .module('portfolio')
    .factory('About', function ($log, $q, $http)
    {
        var service = {};

        var _aboutURI = 'data/about.json';

        var _profile = null;

        service.getProfile = function()
        {
            var deferred = $q.defer();

            if ( _profile !== null )
            {
                $log.debug('The profile data is stored.');

                deferred.resolve( _profile );
            }
            else
            {
                $http
                    .get( _aboutURI, { cache: true } )
                    .success( function(data)
                    {
                        _profile = data;

                        deferred.resolve( _profile );
                    });
            }

            return deferred.promise;
        };

        // Public API
        return service;

    });
