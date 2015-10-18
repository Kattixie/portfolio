'use strict';

describe('Controller: EntryListCtrl', function ()
{
    // Load the controller's module
    beforeEach(module('portfolio'));

    var EntryListCtrl,
        scope;

    // Services to be mocked that need to be available through this block.

    var $controller;

    var mockEntryService = {};

    beforeEach(inject(function($q)
    {
        mockEntryService.entries =
        [
            {
                slug: 'one'
            },
            {
                slug: 'two'
            }
        ];

        mockEntryService.categories =
        [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            }
        ];

        mockEntryService.getAll = function()
        {
            var deferred = $q.defer();

            deferred.resolve(this.entries);

            return deferred.promise;
        };

        mockEntryService.getAllCategories = function()
        {
            return this.categories;
        };
    }));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, _$controller_, $log, $routeParams)
    {
        // The injector unwraps the underscores (_) from around the parameter
        // names when matching

        $controller = _$controller_;

        scope = $rootScope.$new();
        //scope = {};

        EntryListCtrl = $controller('EntryListCtrl',
        {
            // Place here mocked dependencies
            $scope: scope,
            $log: $log,
            $routeParams: $routeParams,
            Entry: mockEntryService
        });

        // This is absolutely necessary to test promises.
        //scope.$digest();
    }));

    it('should attach an array of entries to the scope', function ()
    {
        scope.$digest();

        expect(scope.data.entries.length).toBe(2);
    });

    it('should have a defined object for categories', function ()
    {
        expect(scope.data.categories).toBeDefined();
    });

    it('should attach an array of categories to the scope', function ()
    {
        scope.$digest();

        expect(scope.data.categories.length).toBe(3);
    });
});
