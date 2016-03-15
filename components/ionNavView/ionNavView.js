IonNavigation = {
    skipTransitions: false
};

Template.ionNavView.created = function () {
    this.data = this.data || {};

    // Allow overriding the transition
    if (this.data && this.data.transition) {
        this.transition = this.data.transition;
    }
};

Template.ionNavView.onRendered(function () {
    this.$preLink = () => {
        let $element = this.$('ion-nav-view').first(),
            tElement = $element,
            $ionicConfig = meteoric.service.ionicConfig,
            $scope = this.$scope,
            $attrs = {};

        let navViewCtrl = new meteoric.controller.ionicNavView($scope, $element, $attrs);

        // a nav view element is a container for numerous views
        tElement.addClass('view-container');
        ionic.DomUtil.cachedAttr(tElement, 'nav-view-transition', $ionicConfig.views.transition());

        var viewData = navViewCtrl.init();

        // listen for $stateChangeSuccess
        $scope.on('$stateChangeSuccess', function() {
            updateView(false);
        });
        $scope.on('$viewContentLoading', function() {
            updateView(false);
        });

        // Since ionNavView assumes there is an ion-view below, might aswell use this one.
        // todo: try to utilize the iron router.
        $scope.$childViewAvailable = () => {
            $scope.trigger('$stateChangeSuccess');
        };

        // initial load, ready go
        updateView(true);

        function updateView(firstTime) {
            // get the current local according to the $state
            //var viewLocals = $state.$current && $state.$current.locals[viewData.name];

            // do not update THIS nav-view if its is not the container for the given state
            // if the viewLocals are the same as THIS latestLocals, then nothing to do
            // NOTE: FUCK IT, TRANSITION ALL. I'm not rewriting angular-ui-router and jump off some bridge half way.
            //if (!viewLocals || (!firstTime && viewLocals === latestLocals)) return;

            // update the latestLocals
            //latestLocals = viewLocals;
            //viewData.state = viewLocals.$$state;

            // register, update and transition to the new view
            //navViewCtrl.register(viewLocals);
            navViewCtrl.register(undefined);
        }
    };

    var container = this.find('ion-nav-view');
    container._uihooks = {
        // Override onDestroyed so that's children won't remove themselves immediately.
        removeElement: function(node) { }  // viewSwitcher will remove it hopefully.
    };
});