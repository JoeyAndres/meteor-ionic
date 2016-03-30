ionViewDefault = {
    viewTitle: undefined,
    canSwipeBack: true,
    hideBackButton: false,
    hideNavBar: false
};

Template.ionView.onCreated(function() {
    this.new_scope = true;

    this.title = new ReactiveVar(ionViewDefault.viewTitle);
    this.viewTitle = new ReactiveVar(ionViewDefault.viewTitle);
    this.canSwipeBack = new ReactiveVar(ionViewDefault.canSwipeBack);
    this.hideBackButton = new ReactiveVar(ionViewDefault.hideBackButton);
    this.hideNavBar = new ReactiveVar(ionViewDefault.hideNavBar);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.title.set(isDefined(td.title) ? td.title : ionViewDefault.viewTitle);
        this.viewTitle.set(isDefined(td.viewTitle) ? td.viewTitle : ionViewDefault.viewTitle);
        this.canSwipeBack.set(isDefined(td.canSwipeBack) ? td.canSwipeBack : ionViewDefault.canSwipeBack);
        this.hideBackButton.set(isDefined(td.hideBackButton) ? td.hideBackButton : ionViewDefault.hideBackButton);
        this.hideNavBar.set(isDefined(td.hideNavBar) ? td.hideNavBar : ionViewDefault.hideNavBar);
    });
});

Template.ionView.onRendered(function () {
    let $scope = this.$scope;
    let $element = jqLite(this.firstNode);
    let $attrs = {
        title: this.title,
        viewTitle: this.viewTitle,
        canSwipeBack: this.canSwipeBack,
        hideBackButton: this.hideBackButton,
        hideNavBar: this.hideNavBar
    };

    let viewCtrl;
    $(this).on('$preLink', () => {
        viewCtrl = new $ionicView($scope, $element, $attrs);
        $element.data('$ionViewController', viewCtrl);
    });
    $(this).on('$postLink', () => {
        viewCtrl.init();

        // todo: Find a way for iron:router to generate this.
        $scope.$emit('$stateChangeSuccess');
    });
});