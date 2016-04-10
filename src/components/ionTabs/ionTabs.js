/**
 * @ngdoc directive
 * @name ionTabs
 * @module meteoric
 * @delegate meteoric.service:$ionicTabsDelegate
 * @restrict E
 * @codepen odqCz
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed
 * through.
 *
 * Assign any [tabs class](/docs/components#tabs) to the element to define
 * its look and feel.
 *
 * For iOS, tabs will appear at the bottom of the screen. For Android, tabs will be at the top
 * of the screen, below the nav-bar. This follows each OS's design specification, but can be
 * configured with the {@link meteoric.provider:$ionicConfigProvider}.
 *
 * See the {@link meteoric.directive:ionTab} directive's documentation for more details on
 * individual tabs.
 *
 * Note: do not place ion-tabs inside of an ion-content element; it has been known to cause a
 * certain CSS bug.
 *
 * @usage
 * ```html
 * <ion-tabs class="tabs-positive tabs-icon-top">
 *
 *   <ion-tab title="Home" icon-on="ion-ios-filing" icon-off="ion-ios-filing-outline">
 *     <!-- Tab 1 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="About" icon-on="ion-ios-clock" icon-off="ion-ios-clock-outline">
 *     <!-- Tab 2 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="Settings" icon-on="ion-ios-gear" icon-off="ion-ios-gear-outline">
 *     <!-- Tab 3 content -->
 *   </ion-tab>
 *
 * </ion-tabs>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify these tabs
 * with {@link ionic.service:$ionicTabsDelegate}.
 */

Template.ionTabs.onCreated(function () {
    this.new_scope = true;
    this.data = this.data || {};
});

Template.ionTabs.onRendered(function () {
    let $scope = this.$scope;

    $(this).on('$preLink', () => {
        let $element = jqLite(this.firstNode);
        let tabsCtrl = new $ionicTabs($scope, $element);

        $scope.tabsCtrl = tabsCtrl;
        $scope.$hasTabs = new ReactiveVar(false);
        $scope.$hasTabsTop = new ReactiveVar(false);

        let tElement = $element;
        let innerElement = jqLite(this.$('.tab-nav.tabs')[0]);

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));

        tElement
            .addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());

        $ionicTabsDelegate.addInstance(tabsCtrl);

        this.autorun(() => {
            let td = Template.currentData();
            if (!td) return;

            let value = $element[0].className;

            var isTabsTop = value.indexOf('tabs-top') !== -1;
            var isHidden = value.indexOf('tabs-item-hide') !== -1;
            $scope.$hasTabs.set(!isTabsTop && !isHidden);
            $scope.$hasTabsTop.set(isTabsTop && !isHidden);
            $scope.$emit('$ionicTabs.top', $scope.$hasTabsTop.get());
        });

        function emitLifecycleEvent(ev, data) {
            ev.stopPropagation();
            var previousSelectedTab = tabsCtrl.previousSelectedTab();
            if (previousSelectedTab) {
                previousSelectedTab.$broadcast(ev.name.replace('NavView', 'Tabs'), data);
            }
        }

        $scope.$on('$ionicNavView.beforeLeave', emitLifecycleEvent);
        $scope.$on('$ionicNavView.afterLeave', emitLifecycleEvent);
        $scope.$on('$ionicNavView.leave', emitLifecycleEvent);

        $scope.$on('$destroy', function () {
            // variable to inform child tabs that they're all being blown away
            // used so that while destorying an individual tab, each one
            // doesn't select the next tab as the active one, which causes unnecessary
            // loading of tab views when each will eventually all go away anyway
            $scope.$tabsDestroy = true;
            $ionicTabsDelegate.removeInstance(tabsCtrl);
            tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
            delete $scope.$hasTabs;
            delete $scope.$hasTabsTop;
        });


    });

    $(this).on('$postLink', () => {
        if (!$scope.tabsCtrl.selectedTab()) {
            // all the tabs have been added
            // but one hasn't been selected yet
            $scope.tabCtrl.select(0);
        }
    });
});

Template.ionTabs.helpers({
    tabs() {
        let t = Template.instance();
        let children = t.getChildren();
        children = children.filter(t => t.view.name === 'Template.ionTab');

        return children.map(child => {
            let $childAttrs = child.$attrs;
            return {
                title: $childAttrs.title.get(),
                icon: $childAttrs.icon.get(),
                iconOn: $childAttrs.iconOn.get(),
                iconOff: $childAttrs.iconOff.get(),
                badge: $childAttrs.badge.get(),
                hidden: $childAttrs.hidden.get(),
                disabled: $childAttrs.disabled.get(),
                badgeStyle: $childAttrs.badgeStyle.get(),

                tabCtrl: child.tabCtrl
            };
        });
    }
});