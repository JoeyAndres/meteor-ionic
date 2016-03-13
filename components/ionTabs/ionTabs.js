Template.ionTabs.onCreated(function () {
    this.data = this.data || {};

    this.tabsCtrl = new meteoric.controller.ionicTabs();
});

Template.ionTabs.onRendered(function () {
    this.$preLink = () => {
        this.$scope.tabsCtrl = this.tabsCtrl;
        this.$scope.$hasTabs = new ReactiveVar(false);
        this.$scope.$hasTabsTop = new ReactiveVar(false);

        let $scope = this.$scope;
        let $ionicConfig = meteoric.service.ionicConfig;
        let $ionicTabsDelegate = meteoric.service.ionicTabsDelegate;
        let $ionicHistory = meteoric.service.ionicHistory;
        let tabsCtrl = this.tabsCtrl;
        let tElement = this.$('ion-tabs');
        let innerElement = this.$('.tab-nav.tabs');
        let $element = tElement;

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = meteoric.Utils.to$element($element[0].querySelector('.tabs'));

        tabsCtrl.initialize($scope, $element, $ionicHistory);

        tElement
            .addClass('tabs-' + $ionicConfig.tabs.position() + ' tabs-' + $ionicConfig.tabs.style());

        $ionicTabsDelegate.addAggregate(tabsCtrl);

        this.autorun(() => {
            let td = Template.currentData();
            if (!td) return;

            let value = $element[0].className;

            var isTabsTop = value.indexOf('tabs-top') !== -1;
            var isHidden = value.indexOf('tabs-item-hide') !== -1;
            $scope.$hasTabs.set(!isTabsTop && !isHidden);
            $scope.$hasTabsTop.set(isTabsTop && !isHidden);
            $scope.trigger('$ionicTabs.top', $scope.$hasTabsTop.get());
        });

        function emitLifecycleEvent(ev, data) {
            ev.stopPropagation();
            var previousSelectedTab = tabsCtrl.previousSelectedTab();
            if (previousSelectedTab) {
                previousSelectedTab.$broadcast(ev.name.replace('NavView', 'Tabs'), data);
            }
        }

        $scope.on('$ionicNavView.beforeLeave', emitLifecycleEvent);
        $scope.on('$ionicNavView.afterLeave', emitLifecycleEvent);
        $scope.on('$ionicNavView.leave', emitLifecycleEvent);

        $scope.on('$destroy', function () {
            // variable to inform child tabs that they're all being blown away
            // used so that while destorying an individual tab, each one
            // doesn't select the next tab as the active one, which causes unnecessary
            // loading of tab views when each will eventually all go away anyway
            $scope.$tabsDestroy = true;
            $ionicTabsDelegate.removeAggregate(tabsCtrl);
            tabsCtrl.$tabsElement = tabsCtrl.$element = tabsCtrl.$scope = innerElement = null;
            delete $scope.$hasTabs;
            delete $scope.$hasTabsTop;
        });

        if (!tabsCtrl.selectedTab()) {
            // all the tabs have been added
            // but one hasn't been selected yet
            tabsCtrl.select(0);
        }
    };

    this.$postLink = () => {
        /* Can't select tab here.
         if (!tabsCtrl.selectedTab()) {
         // all the tabs have been added
         // but one hasn't been selected yet
         tabsCtrl.select(0);
         }*/
    };
});

Template.ionTabs.helpers({
    tabs() {
        let t = Template.instance();
        let children = t.getChildren();
        children = children.filter(t => t.view.name === 'Template.ionTab');

        return children.map(child => ({
            title: child.title.get(),
            icon: child.icon.get(),
            iconOn: child.iconOn.get(),
            iconOff: child.iconOff.get(),
            badge: child.badge.get(),
            hidden: child.hidden.get(),
            disabled: child.disabled.get(),
            badgeStyle: child.badgeStyle.get(),
            tabCtrl: child.tabCtrl,
            $tabScope: child.$scope
        }));
    }
});