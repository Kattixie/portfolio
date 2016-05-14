'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myCategorizedList
 * @description
 * # myCategorizedList
 */
angular
    .module('portfolio')
    .directive('myCategorizedList', function ($log, $routeParams, $location, $q)
    {
        return {
            restrict: 'E',
            scope:
            {
                // We want to shallowly watch these properties for changes.
                categories: '=*',
                items: '=*'
            },
            templateUrl: 'views/categorizedlist.html',
            bindToController: true,
            controllerAs: 'list',
            controller: function($scope, $element)
            {
                var CATEGORY_URI_SEPARATOR = ',',
                    ITEM_SELECTOR = '.item';

                var ctrl = this;

                var _initWatch,
                    _initDeferred = $q.defer();

                angular.extend(ctrl,
                {
                    // Array of category slugs that exist in the URI.
                    routeCategories: [],

                    // Array of category IDs that are selected.
                    selectedCategories: [],

                    state:
                    {
                        items: []
                    },

                    // Can't set until the list is populated.
                    elements:
                    {
                        items: []
                    }
                });

                /* SETUP */

                // This gets invoked when we've verified that the number of
                // categories and number of item elements is greater than 0.
                ctrl.init = function()
                {
                    // For segment approach instead:
                    // ctrl.setRouteParamsCategories();
                    ctrl.setCategoryParam();
                    ctrl.setItems();
                    ctrl.setSelectedCategories();

                    _initDeferred.resolve();
                };

                ctrl.isReady = function()
                {
                    return _initDeferred.promise;
                };

                /* CATEGORY URI PARAMETERS */

                // Retrieves parameters from URI search, assuming the URL style
                // is traditional: list?category=cat1,cat2 Currently using this
                // method because changing the path in any other way I've found
                // generates a refresh, which we don't want. Note use of
                // reloadOnSearch: false on $routeProvider in app.js
                ctrl.setCategoryParam = function()
                {
                    var categories = $location.search().category;

                    if (categories)
                    {
                        ctrl.routeCategories = categories.split(CATEGORY_URI_SEPARATOR);

                        // $log.debug('myCategorizedList', 'The route categories: %o', ctrl.routeCategories);
                    }
                    else
                    {
                        ctrl.routeCategories = [];
                    }
                };

                // Retrieves parameters from URI segment, such as:
                // list/cat1,cat2 This works but causes a reload if the path
                // is updated. Need to look into segmented URI approach with
                // Angular. Obviously it's super important to be able to
                // set URIs as the user navigates the app.
                ctrl.setRouteParamsCategories = function()
                {
                    if ( $routeParams.categories )
                    {
                        ctrl.routeCategories = $routeParams.categories.split(CATEGORY_URI_SEPARATOR);
                    }
                    else
                    {
                        ctrl.routeCategories = [];
                    }
                };

                // Traverses categories found in URI and maps them to category
                // data passed to this directive. If a match is found, the
                // category ID is added to the selected categories array.
                ctrl.setSelectedCategories = function()
                {
                    for (var i = 0; i < ctrl.routeCategories.length; i++)
                    {
                        var found = false;

                        for (var j = 0; ! found && j < ctrl.categories.length; j++)
                        {
                            if (ctrl.routeCategories[i] === ctrl.categories[j].slug)
                            {
                                found = true;

                                $log.debug('myCategorizedList', 'The category is selected: %s', ctrl.categories[j].slug );

                                ctrl.addSelectedCategory(ctrl.categories[j].id);
                            }
                        }
                    }
                };

                // Checks if the passed slug is in the URI categories.
                ctrl.inRouteCategories = function(slug)
                {
                    // $log.debug('myCategorizedList', 'A request for the route categories is being made. There are currently [%s] categories in the URI.', ctrl.routeCategories.length);

                    var found = false;

                    for (var i = 0; ! found && i < ctrl.routeCategories.length; i++)
                    {
                        if (ctrl.routeCategories[i] === slug)
                        {
                            found = true;
                        }
                    }

                    return found;
                };

                // Updates URI path to include currently selected categories.
                ctrl.updateUri = function()
                {
                    var slugs = [];

                    for (var i = 0; i < ctrl.selectedCategories.length; i++)
                    {
                        // Category IDs begin at 1, so we need to offse that
                        // value here. Yes, this makes an assumption I don't
                        // feel super comfortable with.
                        slugs[i] = ctrl.categories[ ctrl.selectedCategories[i] - 1 ].slug;
                    }

                    $location.search('category', slugs.join( CATEGORY_URI_SEPARATOR ));
                };

                /* CATEGORIES BEHAVIOR AND STATE */

                ctrl.addSelectedCategory = function(categoryId)
                {
                    ctrl.selectedCategories.push(categoryId);

                    ctrl.showItemsInAnySelectedCategory();

                    ctrl.updateUri();
                };

                ctrl.removeSelectedCategory = function(categoryId)
                {
                    // $log.debug('myCategorizedList', 'The selected categories before deletion: %o', ctrl.selectedCategories);

                    for (var i = 0, found = false; ! found && i < ctrl.selectedCategories.length; i++)
                    {
                        if (ctrl.selectedCategories[i] === categoryId)
                        {
                            ctrl.selectedCategories.splice(i, 1);

                            found = true;
                        }
                    }

                    // Check if any categories are still selected.
                    if (ctrl.selectedCategories.length === 0)
                    {
                        ctrl.showAllItems();
                    }
                    else if (found)
                    {
                        ctrl.showItemsInAnySelectedCategory();
                    }

                    ctrl.updateUri();

                    // $log.debug('myCategorizedList', 'The selected categories after deletion: %o', ctrl.selectedCategories);

                    return found;
                };

                ctrl.getNumSelectedCategories = function()
                {
                    return ctrl.selectedCategories.length;
                };

                /* ITEMS BEHAVIOR AND STATE */

                ctrl.setItems = function()
                {
                    ctrl.setItemsState();
                };

                ctrl.setItemsState = function()
                {
                    for (var i = 0; i < ctrl.elements.items.length; i++)
                    {
                        ctrl.state.items.push(
                        {
                            hidden: false
                        });
                    }

                    return ctrl.state.items;
                };

                // Written to be used with ngShow, but beware that this gets
                // invoked a lot if there are a lot of digest cycles happening.
                ctrl.itemIsVisible = function(targetIndex)
                {
                    // Good way to check how over this is getting called.
                    // $log.debug('myCategorizedList', 'ngShow callback from itemIsVisible');

                    if ( ctrl.selectedCategories.length === 0 )
                    {
                        return true;
                    }
                    else
                    {
                        // Return simple true/false value that updated in
                        // response to category clicks.
                        return ! ctrl.state.items[targetIndex].hidden;

                        // This works, too, but is more expensive and could
                        // be called a lot.
                        // return ctrl.inSelectedCategories(targetIndex);
                    }
                };

                ctrl.hideAllItems = function()
                {
                    for (var i = 0; i < ctrl.state.items.length; i++)
                    {
                        ctrl.state.items[i].hidden = true;
                        // ctrl.elements.items[i].hide();
                    }
                };

                ctrl.hideItemsInCategory = function(categoryId)
                {
                    for (var i = 0; i < ctrl.items.length; i++)
                    {
                        // Does the target category ID exist in the items's
                        // category ID list?
                        if ( ctrl.items[i].categoryIds.indexOf(categoryId) >= 0 )
                        {
                            // Should check if it's already hidden. It could be.
                            ctrl.state.items[i].hidden = true;
                            // ctrl.elements.items[i].hide();
                        }
                    }
                };

                ctrl.showAllItems = function()
                {
                    for (var i = 0; i < ctrl.elements.items.length; i++)
                    {
                        ctrl.state.items[i].hidden = false;
                        // ctrl.elements.items[i].show();
                    }
                };

                ctrl.showItemsInCategory = function(categoryId)
                {
                    for (var i = 0; i < ctrl.items.length; i++)
                    {
                        if ( ctrl.items[i].categoryIds.indexOf(categoryId) >= 0 )
                        {
                            ctrl.state.items[i].hidden = false;
                            // ctrl.elements.items[i].show();
                        }
                    }
                };

                // This function treats categories as being applied to the items
                // with an OR operator. Items that match any selected
                // categories will be shown.
                ctrl.showItemsInAnySelectedCategory = function()
                {
                    for (var i = 0; i < ctrl.items.length; i++)
                    {
                        var found = false;

                        for (var j = 0; ! found && j < ctrl.selectedCategories.length; j++)
                        {
                            var categoryId = ctrl.selectedCategories[j];

                            if ( ctrl.items[i].categoryIds.indexOf(categoryId) >= 0 )
                            {
                                found = true;
                            }
                        }

                        if ( found )
                        {
                            ctrl.state.items[i].hidden = false;
                            // ctrl.elements.items[i].show();
                        }
                        else
                        {
                            ctrl.state.items[i].hidden = true;
                            // ctrl.elements.items[i].hide();
                        }
                    }
                };

                // This function treats categories as being applied to the items
                // with an AND operator. Only items that match all selected
                // categories will be shown.
                ctrl.showItemsInAllSelectedCategories = function()
                {
                    // ctrl.setItems();

                    for (var i = 0; i < ctrl.items.length; i++)
                    {
                        var notFound = false;

                        for (var j = 0; ! notFound && j < ctrl.selectedCategories.length; j++)
                        {
                            var categoryId = ctrl.selectedCategories[j];

                            // Any negative find means the item shouldn't be shown.
                            if ( ctrl.items[i].categoryIds.indexOf(categoryId) === -1 )
                            {
                                notFound = true;
                            }
                        }

                        if ( notFound )
                        {
                            ctrl.state.items[i].hidden = true;
                            // ctrl.elements.items[i].hide();
                        }
                        else
                        {
                            ctrl.state.items[i].hidden = false;
                            // ctrl.elements.items[i].show();
                        }
                    }
                };

                // Checks if the passed item index corresponds to ANY of the
                // selected categories. Originally written to be used with
                // ngShow, but not a good idea for that use due to the
                // work involved here. ngShow gets called a lot.
                ctrl.inSelectedCategories = function(targetIndex)
                {
                    // $log.debug('myCategorizedList', 'Checking if in selected categories... %o', ctrl.selectedCategories);
                    // $log.debug('myCategorizedList', 'The item [%s] belongs to the following categories: %o', ctrl.items[targetIndex].title, ctrl.items[targetIndex].categoryIds);

                    var found = false;

                    for ( var i = 0; ! found && i < ctrl.selectedCategories.length; i++ )
                    {
                        if ( ctrl.items[targetIndex].categoryIds.indexOf( ctrl.selectedCategories[i] ) >= 0 )
                        {
                            found = true;
                        }
                    }

                    return found;
                };

                /* REGISTERED WATCHERS */

                _initWatch = $scope.$watch(function()
                {
                    $log.debug('myCategorizedList', 'Checking if ready.....');

                    ctrl.elements.items = $element.find( ITEM_SELECTOR );

                    return ctrl.categories.length > 0 && ctrl.elements.items.length > 0;
                },
                function(ready)
                {
                    if (ready)
                    {
                        $log.debug('myCategorizedList', 'The list is ready!');

                        ctrl.init();

                        // Stop watching the number of items now.
                        _initWatch();
                    }
                });
            }
        };
    });
