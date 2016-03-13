ionTabDefaults = {
    title: '',
    href: '',
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
    $(this).on('$scopeCreated', () => {
        this.$scope.tabCtrl = this.tabCtrl;
    });
});

Template.ionTab.onRendered(function() {
    let $scope = this.$scope;
    let $element = this.$('div');
    let $ionicConfig = meteoric.service.ionicConfig;
    let element = $element;
    let tabCtrl = this.tabCtrl;

    tabCtrl.initialize($scope, undefined, { }, undefined, undefined);

    // Start of compile function.

    //We create the tabNavTemplate in the compile phase so that the
    //attributes we pass down won't be interpolated yet - we want
    //to pass down the 'raw' versions of the attributes
    var tabNavTemplate = '<ion-tab-nav></ion-tab-nav>';

    var navViewName, isNavView;

    let childElementCount = 1;  // todo: asdf

    this.$preLink = () => {
        var childScope;
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
            tabNavElement.isolateScope().$destroy();
            tabNavElement.remove();
            tabNavElement = tabContentEle = childElement = null;
        });

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

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

        var tabNavElement = $(tabNavTemplate);
        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append(tabNavElement);

        function tabSelected (isSelected) {
            if (isSelected) {
                $scope.$tabSelected = true;
                $element.toggleClass('hide', false);
            } else {
                $scope.$tabSelected = false;
                $element.toggleClass('hide', true);
            }
        };

        this.autorun(() => {
            let isSelected = $scope.tabsCtrl.selectedTab() === $scope;
            tabSelected(isSelected);
        });

        function destroyTab() {
            childScope && childScope.$destroy();
            isTabContentAttached && childElement && childElement.remove();
            tabContentEle.innerHTML = '';
            isTabContentAttached = childScope = childElement = null;
        }

        //$scope.$watch('$tabSelected', tabSelected);

        $scope.on('$ionicView.afterEnter', function() {
            $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
        });

        $scope.on('$ionicView.clearCache', function() {
            if (!$scope.$tabSelected) {
                destroyTab();
            }
        });
    };
});

Template.ionTab.helpers({
    classes: function () {
        var classes = ['tab-item'];
        if (this.class) {
            classes.push(this.class);
        }
        if (this.badgeNumber) {
            classes.push('has-badge');
        }
        return classes.join(' ');
    },

    url: function () {
        if (this.href) {
            return this.href;
        }

        if (this.path && Router.routes[this.path]) {
            return Router.routes[this.path].path(Template.currentData());
        }
    },

    isActive: function () {
        var ionTabCurrent = Session.get('ionTab.current');

        if (this.path && this.path === ionTabCurrent) {
            return 'active';
        }

        // The initial case where there is no localStorage value and
        // no session variable has been set, this attempts to set the correct tab
        // to active based on the router
        var route = Router.routes[this.path];
        if(route && route.path(Template.currentData()) === ionTabCurrent){
            return 'active';
        }
    },

    activeIcon: function () {
        if (this.iconOn) {
            return this.iconOn;
        } else {
            return this.icon;
        }
    },

    defaultIcon: function () {
        if (this.iconOff) {
            return this.iconOff;
        } else {
            return this.icon;
        }
    },

    badgeNumber: function () {
        return this.badgeNumber;
    },

    badgeColor: function () {
        return this.badgeColor||'assertive';
    }
});
