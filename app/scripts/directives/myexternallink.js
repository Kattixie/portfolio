'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myExternalLink
 * @description
 * # myExternalLink
 * Appropriately templates external URLs. Transclude is not used here (though it
 * feels natural) because an extra span tag will appear around the label, and
 * this requires precise control of mark-up.
 */
angular
    .module('portfolio')
    .directive('myExternalLink', function ($log, $parse)
    {
        var ddo =
        {
            restrict: 'E',
            scope:
            {
                href: '@',
                label: '@'
            },
            template: function(tElement, tAttrs)
            {
                // Because values are passed as strings, we can do text
                // manipulation here. No binding is taking place.
                var lastSpaceIndex = tAttrs.label.lastIndexOf(' ');

                var template = '';

                template += '<span class="external">';
                    template += '<a href="' + tAttrs.href + '" target="_blank">';
                        template += '<span class="first-words">' + tAttrs.label.slice(0, lastSpaceIndex + 1) + '</span>';
                        template += '<span class="no-wrap">';
                            template += '<span class="last-word">' + tAttrs.label.slice( lastSpaceIndex + 1 ) + '</span>';
                            template += '<span class="icon"><span class="svg-container"><svg><use xlink:href="#symbol-diagonal-arrow"></use></svg></span></span>';

                            if (tAttrs.punctuation)
                            {
                                template += '<span class="punctuation">' + tAttrs.punctuation + '</span>';
                            }

                        template += '</span>';
                    template += '</a>';
                template += '</span>';

                return template;
            }
        };

        return ddo;
    });
