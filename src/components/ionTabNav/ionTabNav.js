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
 * For a complete, working tab bar example, see the {@link ionic.directive:ionTabs} documentation.
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
 * @param {expression=} ng-click By default, the tab will be selected on click. If ngClick is set, it will not.  You can explicitly switch tabs using {@link ionic.service:$ionicTabsDelegate#select $ionicTabsDelegate.select()}.
 * @param {expression=} hidden Whether the tab is to be hidden or not.
 * @param {expression=} disabled Whether the tab is to be disabled or not.
 */

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