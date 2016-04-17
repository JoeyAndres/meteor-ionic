/**
 * @ngdoc directive
 * @name ionSideMenus
 * @module meteoric
 * @delegate meteoric.service:$ionicSideMenuDelegate
 * @restrict E
 *
 * @description
 * A container element for side menu(s) and the main content. Allows the left and/or right side menu
 * to be toggled by dragging the main content area side to side.
 *
 * To automatically close an opened menu, you can add the {@link meteoric.directive:menuClose} attribute
 * directive. The `menu-close` attribute is usually added to links and buttons within
 * `ion-side-menu-content`, so that when the element is clicked, the opened side menu will
 * automatically close.
 *
 * "Burger Icon" toggles can be added to the header with the {@link meteoric.directive:menuToggle}
 * attribute directive. Clicking the toggle will open and close the side menu like the `menu-close`
 * directive. The side menu will automatically hide on child pages, but can be overridden with the
 * enable-menu-with-back-views attribute mentioned below.
 *
 * By default, side menus are hidden underneath their side menu content and can be opened by swiping
 * the content left or right or by toggling a button to show the side menu. Additionally, by adding the
 * {@link meteoric.directive:exposeAsideWhen} attribute directive to an
 * {@link meteoric.directive:ionSideMenu} element directive, a side menu can be given instructions about
 * "when" the menu should be exposed (always viewable).
 *
 * ![Side Menu](http://ionicframework.com.s3.amazonaws.com/docs/controllers/sidemenu.gif)
 *
 * For more information on side menus, check out:
 *
 * - {@link meteoric.directive:ionSideMenuContent}
 * - {@link meteoric.directive:ionSideMenu}
 * - {@link meteoric.directive:menuToggle}
 * - {@link meteoric.directive:menuClose}
 * - {@link meteoric.directive:exposeAsideWhen}
 *
 * @usage
 * To use side menus, add an `ionSideMenus` parent template. This will encompass all pages that have a
 * side menu, and have at least 2 child elements: 1 `ionSideMenuContent` for the center content,
 * and one or more `ionSideMenu` directives for each side menu(left/right) that you wish to place.
 * `ionSideMenus` are ideally placed in your _layout_ template.
 *
 * ```handlebars
 <template name="layout">
     <body>
         {{#ionSideMenus}}

             {{#ionSideMenu}}
                 <div class="bar bar-header bar-dark">
                     <h1 class="title">Left Menu</h1>
                 </div>
                 <div class="content has-header">
                     <div class="list">
                         <div class="item item-icon-right" ion-menu-close>
                             Close Me <i class="icon ionic-ios-arrow-right"></i>
                         </div>
                     </div>
                 </div>
             {{/ionSideMenu}}

             {{#ionSideMenuContent}}
                 <!-- content goes here -->
             {{/ionSideMenuContent}}

             {{#ionSideMenu side="right"}}
                 <div class="bar bar-header bar-dark" ion-expose-aside-when="large">
                     <h1 class="title">Right Menu</h1>
                 </div>
                 <div class="content has-header">
                     <div class="list">
                         <div class="item item-icon-left" ion-menu-close>
                             <i class="icon ionic-ios-arrow-left"></i> Close Me
                         </div>
                     </div>
                 </div>
             {{/ionSideMenu}}

         {{/ionSideMenus}}
     </body>
 </template>
 * ```
 *
 * @param {bool=} enable-menu-with-back-views Determines whether the side menu is enabled when the
 * back button is showing. When set to `false`, any {@link meteoric.directive:menuToggle} will be hidden,
 * and the user cannot swipe to open the menu. When going back to the root page of the side menu (the
 * page without a back button visible), then any menuToggle buttons will show again, and menus will be
 * enabled again.
 */

Template.ionSideMenus.onCreated(function() {
    this.enableMenuWithBackViews = new ReactiveVar(false);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.enableMenuWithBackViews.set(!!td.enableMenuWithBackViews);
    });
});

Template.ionSideMenus.onRendered(function() {
    let $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = {
            enableMenuWithBackViews: this.enableMenuWithBackViews.get()
        };
    let ctrl = new $ionicSideMenus($scope, $attrs);
    $scope.$sideMenuCtrl = ctrl;
    $element.data('$ionSideMenusController', ctrl);
    
    $(this).on('$preLink', () => {
        ctrl.enableMenuWithBackViews($attrs.enableMenuWithBackViews);

        $scope.$on('$ionicExposeAside', function(evt, isAsideExposed) {
            if (!$scope.$exposeAside) $scope.$exposeAside = {};
            $scope.$exposeAside.active = isAsideExposed;
            $ionicBody.enableClass(isAsideExposed, 'aside-open');
        });

        $scope.$on('$ionicView.beforeEnter', function(ev, d) {
            if (d.historyId) {
                $scope.$activeHistoryId = d.historyId;
            }
        });

        $scope.$on('$destroy', function() {
            $ionicBody.removeClass('menu-open', 'aside-open');
        });
    });
});