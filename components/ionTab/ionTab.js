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
    this.title = new ReactiveVar(ionTabDefaults.title);
    this.href = new ReactiveVar(ionTabDefaults.href);
    this.icon = new ReactiveVar(ionTabDefaults.icon);
    this.iconOn = new ReactiveVar(ionTabDefaults.iconOn);
    this.iconOff = new ReactiveVar(ionTabDefaults.iconOff);
    this.badge = new ReactiveVar(ionTabDefaults.badge);
    this.badgeStyle = new ReactiveVar(ionTabDefaults.badgeStyle);
    this.onSelect = new ReactiveVar(ionTabDefaults.onSelect);
    this.onDeselect = new ReactiveVar(ionTabDefaults.onDeselect);
    this.hidden = new ReactiveVar(ionTabDefaults.hidden);
    this.disabled = new ReactiveVar(ionTabDefaults.disabled);

    this._isTabSelected = new ReactiveVar(false);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.title = new ReactiveVar(isDefined(td.title) ? td.title : ionTabDefaults.title);
        this.href = new ReactiveVar(isDefined(td.href) ? td.href : ionTabDefaults.href);
        this.icon = new ReactiveVar(isDefined(td.icon) ? td.icon : ionTabDefaults.icon);
        this.iconOn = new ReactiveVar(isDefined(td.iconOn) ? td.iconOn : ionTabDefaults.iconOn);
        this.iconOff = new ReactiveVar(isDefined(td.iconOff) ? td.iconOff : ionTabDefaults.iconOff);
        this.badge = new ReactiveVar(isDefined(td.badge) ? td.badge : ionTabDefaults.badge);
        this.badgeStyle = new ReactiveVar(isDefined(td.badgeStyle) ? td.badgeStyle : ionTabDefaults.badgeStyle);
        this.onSelect = new ReactiveVar(isDefined(td.onSelect) ? td.onSelect : ionTabDefaults.onSelect);
        this.onDeselect = new ReactiveVar(isDefined(td.onDeselect) ? td.onDeselect : ionTabDefaults.onDeselect);
        this.hidden = new ReactiveVar(isDefined(td.hidden) ? td.hidden : ionTabDefaults.hidden);
        this.disabled = new ReactiveVar(isDefined(td.disabled) ? td.disabled : ionTabDefaults.disabled);
    });

    this.tabCtrl = new meteoric.controller.ionicTab();
});

Template.ionTab.onRendered(function() {
    this.$preLink = () => {
        let $scope = this.$scope;
        $scope.tabCtrl = this.tabCtrl;
        let $element = this.$('div');
        let $ionicConfig = meteoric.service.ionicConfig;
        let $ionicHistory = meteoric.service.ionicHistory;
        let element = $element;
        let tabCtrl = this.tabCtrl;
        let $attrs = {};

        this.autorun(() => {
            $attrs = {
                href: this.href.get()
            };

            _.extend(this.$scope, {
                title: this.title.get(),
                href: this.href.get()
            });
        });

        tabCtrl.initialize($scope, $ionicHistory, $attrs, undefined, undefined);

        // Start of compile function.

        var navViewName, isNavView;

        var childElement;
        var tabsCtrl = $scope.tabsCtrl;
        var isTabContentAttached = false;
        $scope.$tabSelected = false;

        tabsCtrl.add($scope);
        $scope.on('$destroy', function() {
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

        $scope.on('$stateChangeSuccess', selectIfMatchesState);
        selectIfMatchesState();
        function selectIfMatchesState() {
            if (tabCtrl.tabMatchesState()) {
                tabsCtrl.select($scope, false);
            }
        }

        let tabSelected = isSelected => {
            this._isTabSelected.set(isSelected);

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

        $scope.on('$ionicView.afterEnter', function() {
            $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
        });
    };
});

Template.ionTab.helpers({
    isTabActive() {
        return Template.instance()._isTabSelected.get();
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
