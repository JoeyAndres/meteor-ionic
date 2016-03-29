Template.ionNavBar.onCreated(function() {
    this.new_scope = true;

    // todo: See the point of delegate-handle
    this.alignTitle = this.data ? this.data.alignTitle : null;
    this.noTapScroll = this.data ?  this.data.noTapScroll : false;

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;
    });
});

Template.ionNavBar.onRendered(function() {
    let $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attrs = {
            alignTitle: this.alignTitle
        };

    let ctrl;
    $(this).on('$preLink', () => {
        ctrl = new $ionicNavBar($scope, $element, $attrs);

        // meteoric: Other templates with same scope need access to this.
        $scope.$ionicNavBar = ctrl;
    });

    $(this).on('$postLink', () => {
        ctrl.init();
    });

    this.firstNode._uihooks = {
        // Override onDestroyed so that's children won't remove themselves immediately.
        removeElement: function(node) { }  // viewSwitcher will remove it hopefully.
    };
});