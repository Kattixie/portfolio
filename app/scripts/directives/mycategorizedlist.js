'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myCategorizedList
 * @description
 * # myCategorizedList
 */
angular
    .module('portfolio')
    .directive('myCategorizedList', function ($log)
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
                var ctrl = this;

                ctrl.routeCategories = [];
                ctrl.selectedCategories = [];

                ctrl.elements = {};
                ctrl.state = {};

                // Can't set these items until the list is populated.
                ctrl.elements.items = [];
                ctrl.state.items = [];

                ctrl.setItems = function()
                {
                    ctrl.setItemsState();
                    // ctrl.setItemsElements();
                };

                ctrl.setItemsState = function()
                {
                    if ( ctrl.state.items.length === 0 )
                    {
                        var items = $element.find('.item');

                        for (var i = 0; i < items.length; i++)
                        {
                            ctrl.state.items.push(
                            {
                                hidden: false
                            });
                        }
                    }

                    return ctrl.state.items;
                };

                ctrl.setItemsElements = function()
                {
                    if ( ctrl.elements.items.length === 0 )
                    {
                        var items = $element.find('.item');

                        for (var i = 0; i < items.length; i++)
                        {
                            ctrl.elements.items.push( angular.element(items[i]) );
                        }
                    }

                    $log.debug('myCategorizedList', 'The item elements: %o', ctrl.elements.items);

                    return ctrl.elements.items;
                };

                ctrl.addSelectedCategory = function(categoryId)
                {
                    if (ctrl.selectedCategories.length === 0)
                    {
                        ctrl.hideAllItems();
                    }

                    ctrl.selectedCategories.push(categoryId);

                    ctrl.showItemsInAnySelectedCategory();
                };

                ctrl.removeSelectedCategory = function(categoryId)
                {
                    $log.debug('myCategorizedList', 'The selected categories before deletion: %o', ctrl.selectedCategories);

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

                    $log.debug('myCategorizedList', 'The selected categories after deletion: %o', ctrl.selectedCategories);

                    return found;
                };

                ctrl.getNumSelectedCategories = function()
                {
                    return ctrl.selectedCategories.length;
                };

                // Written to be used with ngShow, but beware that this gets
                // invoked a lot if there are a lot of digest cycles happening.
                ctrl.itemIsVisible = function(targetIndex)
                {
                    $log.debug('myCategorizedList', 'ngShow callback from itemIsVisible');

                    if ( ctrl.selectedCategories.length === 0 )
                    {
                        return true;
                    }
                    else
                    {
                        return ! ctrl.state.items[targetIndex].hidden;

                        // This works, too, but is more expensive and could
                        // be called a lot.
                        // return ctrl.inSelectedCategories(targetIndex);
                    }
                };

                ctrl.hideAllItems = function()
                {
                    ctrl.setItems();

                    for (var i = 0; i < ctrl.elements.items.length; i++)
                    {
                        ctrl.elements.items[i].hide();
                    }
                };

                ctrl.hideItemsInCategory = function(categoryId)
                {
                    ctrl.setItems();

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

                // This function treats categories as being applied to the items
                // with an OR operator. Items that match any selected
                // categories will be shown.
                ctrl.showItemsInAnySelectedCategory = function()
                {
                    ctrl.setItems();

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
                    ctrl.setItems();

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

                ctrl.showAllItems = function()
                {
                    ctrl.setItems();

                    for (var i = 0; i < ctrl.elements.items.length; i++)
                    {
                        ctrl.state.items[i].hidden = false;
                        // ctrl.elements.items[i].show();
                    }
                };

                ctrl.showItemsInCategory = function(categoryId)
                {
                    ctrl.setItems();

                    for (var i = 0; i < ctrl.items.length; i++)
                    {
                        if ( ctrl.items[i].categoryIds.indexOf(categoryId) >= 0 )
                        {
                            ctrl.state.items[i].hidden = false;
                            // ctrl.elements.items[i].show();
                        }
                    }
                };

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

                /*
                ctrl.setRouteCategories = function()
                {
                    if ( $routeParams.categories )
                    {
                        ctrl.routeCategoires = $routeParams.categories.split('+').map(Number);
                    }
                };

                ctrl.setDefaultCategoryState = function()
                {
                    ctrl.setRouteCategories();

                    for (var i = 0; i < ctrl.categories.length; i++)
                    {
                        if ( ctrl.routeCategories.indexOf( ctrl.categories[i].id ) !== -1 )
                        {
                            ctrl.categories[i].isSelected = true;
                        }
                        else
                        {
                            ctrl.categories[i].isSelected = null;
                        }

                        if ( ctrl.categories[i].count > 0 )
                        {
                            ctrl.selectedCategories.push( ctrl.categories[i].id );
                        }
                    }
                };
                */
            }
        };
    });
