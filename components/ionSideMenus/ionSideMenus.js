/**
 * @module meteoric
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