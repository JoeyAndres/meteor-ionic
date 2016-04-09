/**
 * @ngdoc directive
 * @name ionTab
 * @module meteoric
 * @restrict E
 * @parent meteoric.directive:ionTabs
 *
 * @description
 * Contains a tab's content.  The content only exists while the given tab is selected.
 *
 * Each ionTab has its own view history.
 *
 * @usage
 * ```html
 * <ion-tab
 *   title="Tab!"
 *   icon="my-icon"
 *   href="#/tab/tab-link"
 *   on-select="onTabSelected()"
 *   on-deselect="onTabDeselected()">
 * </ion-tab>
 * ```
 * For a complete, working tab bar example, see the {@link meteoric.directive:ionTabs} documentation.
 *
 * @param {string} title The title of the tab.
 * @param {string=} href The link that this tab will navigate to when tapped.
 * @param {string=} icon The icon of the tab. If given, this will become the default for icon-on and icon-off.
 * @param {string=} icon-on The icon of the tab while it is selected.
 * @param {string=} icon-off The icon of the tab while it is not selected.
 * @param {expression=} badge The badge to put on this tab (usually a number).
 * @param {expression=} badge-style The style of badge to put on this tab (eg: badge-positive).
 * @param {expression=} on-select Called when this tab is selected.
 * @param {expression=} on-deselect Called when this tab is deselected.
 * @param {expression=} ng-click By default, the tab will be selected on click. If ngClick is set, it will not.  You can explicitly switch tabs using {@link meteoric.service:$ionicTabsDelegate#select $ionicTabsDelegate.select()}.
 * @param {expression=} hidden Whether the tab is to be hidden or not.
 * @param {expression=} disabled Whether the tab is to be disabled or not.
 */

ionTabDefaults = {
    title: '',
    href: null,
    icon: '',
    iconOn: '',
    iconOff: '',
    badge: '',
    badgeStyle: '',
    onSelect: noop,
    onDeselect: noop,
    hidden: false,
    disabled: false
};

Template.ionTab.onCreated(function() {
    this.new_scope = true;

    this.$attrs = {};
    this.$attrs.title = new ReactiveVar(ionTabDefaults.title);
    this.$attrs.href = new ReactiveVar(ionTabDefaults.href);
    this.$attrs.icon = new ReactiveVar(ionTabDefaults.icon);
    this.$attrs.iconOn = new ReactiveVar(ionTabDefaults.iconOn);
    this.$attrs.iconOff = new ReactiveVar(ionTabDefaults.iconOff);
    this.$attrs.badge = new ReactiveVar(ionTabDefaults.badge);
    this.$attrs.badgeStyle = new ReactiveVar(ionTabDefaults.badgeStyle);
    this.$attrs.onSelect = new ReactiveVar(ionTabDefaults.onSelect);
    this.$attrs.onDeselect = new ReactiveVar(ionTabDefaults.onDeselect);
    this.$attrs.hidden = new ReactiveVar(ionTabDefaults.hidden);
    this.$attrs.disabled = new ReactiveVar(ionTabDefaults.disabled);

    this._isTabActive = new ReactiveVar(false);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.$attrs.title = new ReactiveVar(isDefined(td.title) ? td.title : ionTabDefaults.title);
        this.$attrs.href = new ReactiveVar(isDefined(td.href) ? td.href : ionTabDefaults.href);
        this.$attrs.icon = new ReactiveVar(isDefined(td.icon) ? td.icon : ionTabDefaults.icon);
        this.$attrs.iconOn = new ReactiveVar(isDefined(td.iconOn) ? td.iconOn : ionTabDefaults.iconOn);
        this.$attrs.iconOff = new ReactiveVar(isDefined(td.iconOff) ? td.iconOff : ionTabDefaults.iconOff);
        this.$attrs.badge = new ReactiveVar(isDefined(td.badge) ? td.badge : ionTabDefaults.badge);
        this.$attrs.badgeStyle = new ReactiveVar(isDefined(td.badgeStyle) ? td.badgeStyle : ionTabDefaults.badgeStyle);
        this.$attrs.onSelect = new ReactiveVar(isDefined(td.onSelect) ? td.onSelect : ionTabDefaults.onSelect);
        this.$attrs.onDeselect = new ReactiveVar(isDefined(td.onDeselect) ? td.onDeselect : ionTabDefaults.onDeselect);
        this.$attrs.hidden = new ReactiveVar(isDefined(td.hidden) ? td.hidden : ionTabDefaults.hidden);
        this.$attrs.disabled = new ReactiveVar(isDefined(td.disabled) ? td.disabled : ionTabDefaults.disabled);
    });

    this.tabCtrl = null;
});

Template.ionTab.onRendered(function() {
    let $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = this.$attrs;

    _.extend($scope, {
        title: this.$attrs.title.get(),
        href: this.$attrs.href.get()
    });

    $scope.tabCtrl = new $ionicTab($scope, $attrs);
    let tabCtrl = $scope.tabCtrl;
    this.tabCtrl = tabCtrl;

    // Start of compile function.

    var navViewName, isNavView;

    $(this).on('$postLink', function() {

        var childElement;
        var tabsCtrl = $scope.tabsCtrl;
        var isTabContentAttached = false;
        $scope.$tabSelected = false;

        tabsCtrl.add($scope);
        $scope.$on('$destroy', function() {
            if (!$scope.$tabsDestroy) {
                // if the containing ionTabs directive is being destroyed
                // then don't bother going through the controllers remove
                // method, since remove will reset the active tab as each tab
                // is being destroyed, causing unnecessary view loads and transitions
                tabsCtrl.remove($scope);
            }
        });

        if (navViewName) {
            tabCtrl.navViewName = $scope.navViewName = navViewName;
        }

        $scope.$on('$stateChangeSuccess', $stateChangeSuccess);
        function $stateChangeSuccess(e) {
            e.stopPropagation();
            selectIfMatchesState();
        }

        selectIfMatchesState();
        function selectIfMatchesState(e) {
            if (tabCtrl.tabMatchesState()) {
                tabsCtrl.select($scope, false);
            }
        }

        let tabSelected = isSelected => {
            this._isTabActive.set(isSelected);

            if (isSelected) {
                $scope.$tabSelected = true;
                isTabContentAttached = true;
                $element.toggleClass('hide', false);
            } else {
                $scope.$tabSelected = false;
                $element.toggleClass('hide', true);
            }
        };

        this.autorun(() => {
            let isSelected = $scope.tabsCtrl.selectedTab() === $scope;
            tabSelected(isSelected);
            selectIfMatchesState();
        });

        $scope.$on('$ionicView.afterEnter', function() {
            $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
        });
    });
});

Template.ionTab.helpers({
    isTabActive() {
        return Template.instance()._isTabActive.get();
    },

    url: function () {
        if (this.href) {
            return this.href;
        }

        if (this.path && Router.routes[this.path]) {
            return Router.routes[this.path].path(Template.currentData());
        }
    }
});
