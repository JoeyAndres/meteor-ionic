IonSideMenu = {
    snapper: null,  // Make this private in the future.

    // Note that meteor renders most deeply nested template first before the outer most.
    // Thus, if the child happens toc all any of these, before we are rendered, then
    // error occurs. To solve that, dummy functions are provided.
    enable: () => {},
    disable: () => {}
};

Template.ionSideMenuContainer.onCreated(function () {
    this.data = this.data || {};
    this.side = this.data.side || 'both';
    this.dragContent = true;

    if (typeof this.data.dragContent != 'undefined') {
        this.dragContent = this.data.dragContent
    }

    this.sideMenuCtrl = new meteoric.controller.ionicSideMenus();
});

Template.ionSideMenuContainer.onRendered(function() {
    this.$preLink = () => {
        let $scope = this.$scope;
        $scope.sideMenuCtrl = this.sideMenuCtrl;
        this.sideMenuCtrl.initialize($scope);

        let $element = this.$('div');
        $.data($element.get(0), '$ionSideMenusController', this.sideMenuCtrl);
    }
});

// todo: delete this.
Template.ionSideMenuContainer.events({
    /**
     * menu-close
     *
     * Note: To emulate the attribute menu-close directive. It
     *       is placed here. Just like the original, only child elements
     *       of DOM containing the ionSideMenusController can attain
     *       the ionSideMenusController.
     */
    'click [menu-close]': function (event, template) {

    },

    'click [menu-toggle]': function (event, template) {

    }
});