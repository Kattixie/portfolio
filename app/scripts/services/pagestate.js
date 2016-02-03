'use strict';

/**
 * @ngdoc service
 * @name portfolio.PageState
 * @description
 * # PageState
 */
angular
    .module('portfolio')
    .factory('PageState', function ($rootScope, config)
    {
        var service = {};

        var _projectTitle = '';

        var _pageTitle = '';

        service.setProjectTitle = function(title)
        {
            _projectTitle = (title) ? title : config.PROJECT_TITLE;
        };

        service.setTitle = function(title)
        {
            if ( ! _projectTitle )
            {
                service.setProjectTitle();
            }

            var newTitle = _projectTitle;

            if (title)
            {
                newTitle += ' / ' + title;
            }

            // This is currently set up so that we don't have to create a
            // controller for the page title. However, if we want to avoid
            // using rootScope, we could probably do this. We could also add a
            // directive to the title. Although, it sounds like there are some
            // problems with the page title template without the use of
            // ng-bind: http://stackoverflow.com/a/22467512
            $rootScope.title = newTitle;
        };

        // Public API
        return service;
    });
