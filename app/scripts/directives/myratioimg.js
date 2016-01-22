'use strict';

/**
 * @ngdoc directive
 * @name portfolio.directive:myRatioImg
 * @description
 * # myRatioImg
 * This fairly basic directive exists to simplify use of images that above all
 * need to maintain a particular aspect ratio. Since there is not a great way to
 * achieve this without wrapper elements, hopefully this reduces confusion and
 * at least guarantees consistent implementation throughout a project.
 */
angular
    .module('portfolio')
    .directive('myRatioImg', function ($log, myRatioDirective)
    {
        $log.debug('Setting myRatioImg base.');

        // var base = myRatioDirective[0];

        $log.debug('Done setting myRatioImg base.');

        // This works in overriding properties and functions, but it offers no
        // way to invoke the functions it overrides (because they are simply
        // overwritten). We could try doing this only for properties that
        // we want to override without invoking the parent.
        // var directiveDefinitionObject = angular.extend( base, { } );

        var directiveDefinitionObject =
        {
            restrict: 'E',
            transclude: true,
            scope:
            {
                fullSize: '@',
                height: '@',
                path: '@',
                useNgSrc: '@',
                width: '@'
            },
            template: function(tElement, tAttrs)
            {
                $log.debug('Setting myRatioImg template');

                var base = myRatioDirective[0];

                var baseTemplate = base.template();

                var subTemplate = '';

                if ( tAttrs.useNgSrc === 'true' )
                {
                    // subTemplate += '<img ng-src="' + tAttrs.path + '">';
                    subTemplate += '<img ng-src="{{::path}}">';
                }
                else
                {
                    // subTemplate += '<img my-src="' + tAttrs.path + '">';
                    subTemplate += '<img my-src="{{::path}}">';
                }

                subTemplate += '<ng-transclude></ng-transclude>';

                // Replace the transclude tag with the sub-template. This
                // assumes there is only one transclude element in the base
                // template and that it is an element and not an attribute.
                var template = baseTemplate.replace('<ng-transclude></ng-transclude>', subTemplate);

                return template;
            },
            controller: function($scope)
            {
                $log.debug('Setting controller of myRatioImg.');

                var self = this;

                self.getHeight = function()
                {
                    return $scope.height;
                };

                self.getWidth = function()
                {
                    return $scope.width;
                };
            },
            link: function(scope, iElement, iAttrs)
            {
                $log.debug('Setting myRatioImg link');

                var base = myRatioDirective[0];

                // You're gonna share stuff and you're gonna freaking like it.
                base.link(scope, iElement, iAttrs);

                $log.debug('Done setting base link');

                // Width and height of 100% are specified because there
                // may be cases where the image is being blown up if the
                // data specifies. (Example: animated GIFs)
                iElement
                    .find('img')
                    .css({
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: '100%'
                    });
            }
        };

        return directiveDefinitionObject;
    });
