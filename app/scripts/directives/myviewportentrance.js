'use strict';

/**
* @ngdoc directive
* @name portfolio.directive:myViewportEntrance
* @description
* # myViewportEntrance
* Adds appropriate ngAnimate classes when the element is in view (based on
* scroll position). Some conventions here are modeled after Angular's source
* code.
*/
angular
    .module('portfolio')
    .directive('myViewportEntrance', function ($log, $animate, $timeout, WindowState)
    {
        return {

            restrict: 'A',
            controllerAs: 'viewport',
            bindToController: true,
            controller: function($scope, $element, $attrs)
            {
                var IN_VIEW_CLASS = 'ng-visible';
                var OUT_OF_VIEW_CLASS = 'ng-hidden';

                // $log.debug('myViewportEntrance', 'Animate is enabled: ' + $animate.enabled() );

                var ctrl = this;

                var element = angular.element($element),
                    inView,
                    repeat,
                    elementScrollProps,
                    updatePropsPerScroll = true,
                    inViewTO,
                    outOfViewTO,
                    inClassesSet = false,
                    outClassesSet = true;

                this.init = function()
                {
                    element.addClass(OUT_OF_VIEW_CLASS);

                    if ( $attrs.repeat === undefined || $attrs.repeat === 'true' )
                    {
                        repeat = true;
                    }
                    else if ( $attrs.repeat === 'false' )
                    {
                        repeat = false;
                    }

                    $log.debug('myViewportEntrance', 'The repeat variable: %s', repeat);

                    ctrl
                        .setElement()
                        .then( function(result)
                        {
                            // This function is necessary. We can't invoke
                            // setInView() directly in then().

                            // $log.debug('The setElementPositions promise has been resolved.');

                            ctrl.setInView();
                        });
                };

                this.setInView = function()
                {
                    inView = WindowState.inView( elementScrollProps, 1.00, 1.15 );

                    if ( inView )
                    {
                        ctrl.setInClasses();
                    }
                    else
                    {
                        ctrl.setOutClasses();
                    }
                };

                this.setElement = function()
                {
                    elementScrollProps =
                    {
                        backTrackingMode:   false
                    };

                    return ctrl.setElementPositions();
                };

                this.setElementPositions = function()
                {
                    // Might need to set a timeout here depending on ngView
                    // transitions. Couldn't get any load listeners to work.
                    // Should probably globally set ngView transition time
                    // somewhere if this is the case.
                    return $timeout(function()
                    {

                        var offset = element.offset(),
                            height = element.outerHeight();

                        elementScrollProps.top = offset.top;
                        elementScrollProps.bottom = offset.top + height;
                        elementScrollProps.height = height;

                    }, 300, false);
                };

                this.setInClasses = function()
                {
                    // This check is important to prevent an unnecessary
                    // digests, which could slow down the app. Realy wish
                    // ngAnimate didn't need a digest to apply classes.
                    if ( ! inClassesSet )
                    {
                        // Need timeout or something else that safely runs
                        // $apply().
                        inViewTO = $timeout(function()
                        {
                            // ngAnimate adds the following classes in the
                            // following order:
                            // ng-animate
                            // ng-{OUT_OF_VIEW_CLASS}-remove
                            // ng-{IN_VIEW_CLASS}-add
                            // ng-{IN_VIEW_CLASS}
                            // ng-{OUT_OF_VIEW_CLASS}-remove-active
                            // ng-{IN_VIEW_CLASS}-add-active
                            $animate.setClass($element, IN_VIEW_CLASS, OUT_OF_VIEW_CLASS);

                            inClassesSet = true;
                            outClassesSet = false;

                            if ( ! repeat )
                            {
                                $log.debug('myViewportEntrance', 'In classes have been set, now destroying...');

                                ctrl.onDestroy();
                            }
                        });

                        // This works well with transition.
                        // element.removeClass(OUT_OF_VIEW_CLASS).addClass(IN_VIEW_CLASS);
                    }
                };

                this.setOutClasses = function()
                {
                    if ( ! outClassesSet )
                    {
                        outOfViewTO = $timeout(function()
                        {
                            // ngAnimate adds the following classes in the
                            // following order:
                            // ng-animate
                            // ng-{IN_VIEW_CLASS}-remove
                            // ng-{OUT_OF_VIEW_CLASS}-add
                            // ng-{OUT_OF_VIEW_CLASS}
                            // ng-{IN_VIEW_CLASS}-remove-active
                            // ng-{OUT_OF_VIEW_CLASS}-add-active
                            $animate.setClass($element, OUT_OF_VIEW_CLASS, IN_VIEW_CLASS);

                            outClassesSet = true;
                            inClassesSet = false;
                        });

                        // This works well with transition.
                        // _element.removeClass(IN_VIEW_CLASS).addClass(OUT_OF_VIEW_CLASS);
                    }

                };

                this.onScroll = function()
                {
                    if ( inView && WindowState.scrollDirectionHasChanged() )
                    {
                        elementScrollProps.backTrackingMode = true;
                    }

                    if ( updatePropsPerScroll )
                    {
                        ctrl.setElementPositions();
                    }

                    inView = WindowState.inView( elementScrollProps, 1.00, 1.15 );

                    if ( inView )
                    {
                        ctrl.setInClasses();
                    }
                    else
                    {
                        // Exit back-tracking mode, if in it.
                        if ( elementScrollProps.backTrackingMode )
                        {
                            elementScrollProps.backTrackingMode = false;
                        }

                        ctrl.setOutClasses();
                    }
                };

                this.onDestroy = function()
                {
                    WindowState.jqWindow.off('scroll', this.onScroll);

                    $timeout.cancel( inViewTO );
                    $timeout.cancel( outOfViewTO );
                };

                this.init();

                $scope.$on('$destroy', this.onDestroy);

                WindowState.jqWindow.on('scroll', this.onScroll);
            }
        };
    });
