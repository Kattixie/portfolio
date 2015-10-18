'use strict';

/**
 * @ngdoc overview
 * @name portfolio
 * @description
 * # portfolio
 *
 * Main module of the application.
 */
angular
    .module('portfolio', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config( function($logProvider, $routeProvider) {

        $logProvider.debugEnabled(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl', // Because it's declared here, it is not necessary to use ng-controller in the mark-up.
                controllerAs: 'main'
            })
            .when('/list', {
                templateUrl: 'views/entrylist.html',
                controller: 'EntryListCtrl',
                controllerAs: 'entryList'
            })
            .when('/list/:categories', {
                templateUrl: 'views/entrylist.html',
                controller: 'EntryListCtrl',
                controllerAs: 'entryList'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl',
                controllerAs: 'about'
            })
            .when('/:slug', {
                templateUrl: 'views/entry.html',
                controller: 'EntryCtrl',
                controllerAs: 'entry'
                //bindToController: true
            })
            .otherwise({
                redirectTo: '/'
            });
    });
