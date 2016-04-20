'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myBindHtml
 * @description
 * # myBindHtml
 * Behaves similarly to ngBindHtml, except that it allows us to insert custom
 * directives into the HTML when certain patterns are matched. This is currently
 * done through the linking function.
 */
angular
    .module('portfolio')
    .directive('myBindHtml', function ($log, $parse, $sanitize, $sce, $compile)
    {
        // Targets external URLs without exact sub-domain/top-level domain
        var _linkPattern = new RegExp('<a href="(https?:\/\/(?:www\.)?)(?!' + window.location.hostname.replace(/\./g, '\\.') + ')([^"]+)">([^<]+)<\/a>([.,;?])?', 'g');

        var ddo =
        {
            restrict: 'A',
            compile: function(tElement, tAttrs)
            {
                var myBindHtmlGetter = $parse(tAttrs.myBindHtml);

                var myBindHtmlWatch = $parse(tAttrs.myBindHtml, function(value)
                {
                    return (value || '').toString();
                });

                $compile.$$addBindingClass(tElement);

                return {

                    post: function(scope, iElement, iAttrs)
                    {
                        $compile.$$addBindingInfo(iElement, iAttrs.myBindHtml);

                        scope.$watch(myBindHtmlWatch, function()
                        {
                            var htmlString = $sanitize( myBindHtmlGetter(scope) );

                            // Insert hooks for custom directive replacements
                            // here. Note that all custom directives used here
                            // will need to do one-way string binding.
                            htmlString = htmlString.replace(_linkPattern, '<my-external-link href="$1$2" label="$3" punctuation="$4"></my-external-link>');

                            $log.debug('The HTML: %s', htmlString);

                            // Since we ran sanitize before inserting our custom
                            // directives, this should be OK.
                            //iElement.html( $sce.trustAsHtml(htmlString) || '' );

                            iElement.html( htmlString );

                            // Need to compile for custom directives to get
                            // parsed/interpreted.
                            $compile(iElement.find('my-external-link'))(scope);
                        });
                    }
                };
            }
        };

        return ddo;
    });
