Template.ionTabNav.onCreated(function() {
    this.new_scope = true;

    this.title = new ReactiveVar(ionTabDefaults.title);
    this.icon = new ReactiveVar(ionTabDefaults.icon);
    this.iconOn = new ReactiveVar(ionTabDefaults.iconOn);
    this.iconOff = new ReactiveVar(ionTabDefaults.iconOff);
    this.badge = new ReactiveVar(ionTabDefaults.badge);
    this.hidden = new ReactiveVar(ionTabDefaults.hidden);
    this.disabled = new ReactiveVar(ionTabDefaults.disabled);
    this.badgeStyle = new ReactiveVar(ionTabDefaults.badgeStyle);

    this.$tabScope = null;
    this.tabCtrl = null;

    this.initialized = new ReactiveVar(false);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;
        this.title.set(isDefined(td.title) ? td.title : ionTabDefaults.title);
        this.icon.set(isDefined(td.icon) ? td.icon : ionTabDefaults.icon);
        this.iconOn.set(isDefined(td.iconOn) ? td.iconOn : ionTabDefaults.iconOn);
        this.iconOff.set(isDefined(td.iconOff) ? td.iconOff : ionTabDefaults.iconOff);
        this.badge.set(isDefined(td.badge) ? td.badge : ionTabDefaults.badge);
        this.hidden.set(isDefined(td.hidden) ? td.hidden : ionTabDefaults.hidden);
        this.disabled.set(isDefined(td.disabled) ? td.disabled : ionTabDefaults.disabled);
        this.badgeStyle.set(isDefined(td.badgeStyle) ? td.badgeStyle : ionTabDefaults.badgeStyle);

        if (!td.tabCtrl) throw new Meteor.Error('Template.ionTabNav must be passed tabCtrl.');
        this.tabCtrl = td.tabCtrl;
    });
});

Template.ionTabNav.onRendered(function() {
    this.assertParent(Template.ionTabs);
    
    this.$preLink = () => {
        let $scope = this.$scope,
            $element = $(this.$('.tab-item').get(0)),
            $attrs = this;
        $scope.tabCtrl = this.tabCtrl;
        _.extend($scope, {
            title: this.title,
            icon: this.icon,
            iconOn: this.iconOn,
            iconOff: this.iconOff,
            badge: this.badge,
            hidden: this.hidden,
            disabled: this.disabled,
            badgeStyle: this.badgeStyle
        });
        var tabsCtrl = $scope.tabsCtrl,
            tabCtrl = $scope.tabCtrl;

        //Remove title attribute so browser-tooltip does not appear
        $scope.selectTab = function (e) {
            tabsCtrl.select(tabCtrl.$scope, true);
        };
        $element.on('click', function (event) {
            $scope.selectTab(event);
        });

        $scope.isHidden = function () {
            if ($attrs.hidden.get() === 'true' || $attrs.hidden.get() === true) return true;
            return false;
        };

        $scope.getIconOn = function () {
            return $scope.iconOn.get() || $scope.icon.get();
        };
        $scope.getIconOff = function () {
            return $scope.iconOff.get() || $scope.icon.get();
        };

        $scope.isTabActive = function () {
            let isSelected = tabsCtrl.selectedTab() === tabCtrl.$scope;
            return isSelected;
        };

        this.initialized.set(true);
    };
});

Template.ionTabNav.helpers({
    isHidden: function() {
        if (!Template.instance().initialized.get()) return false;
        return Template.instance().$scope.isHidden();
    },

    isTabActive: function() {
        if (!Template.instance().initialized.get()) return false;
        return Template.instance().$scope.isTabActive();
    },

    getIconOff() {
        if (!Template.instance().initialized.get()) return '';
        return Template.instance().$scope.getIconOff();
    },

    getIconOn() {
        if (!Template.instance().initialized.get()) return '';
        return Template.instance().$scope.getIconOn();
    },

    getIconOff_and_isTabActive() {
        let t = Template.instance();
        if (!t.initialized.get()) return false;
        return t.$scope.getIconOff() && !t.$scope.isTabActive();
    },

    getIconOn_and_isTabActive() {
        let t = Template.instance();
        if (!t.initialized.get()) return false;
        return t.$scope.getIconOn() && t.$scope.isTabActive();
    }
});