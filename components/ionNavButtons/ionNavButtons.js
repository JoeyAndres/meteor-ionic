Template.ionNavButtons.onCreated(function() {
    this.side = isDefined(this.data) ? this.data.side : 'left';
    this.onClick = isDefined(this.data.onClick) ? this.data.onClick : noop;

    this._rid = null;
});

Template.ionNavButtons.onRendered(function() {
    let tElement = jqLite(this.firstNode),
        tAttrs = {
            side: this.side
        };

    var side = 'left';

    if (/^primary|secondary|right$/i.test(tAttrs.side || '')) {
        side = tAttrs.side.toLowerCase();
    }

    var spanEle = $document[0].createElement('span');
    spanEle.className = side + '-buttons';
    spanEle.innerHTML = tElement.html();

    var navElementType = side + 'Buttons';

    tElement.attr('class', 'hide');
    tElement.empty();

    // Attach a rid (random id) so we can identify this.
    // After that, we can now listen for events.
    let $spanEle = jqLite(spanEle);
    this._rid = $spanEle.attr('rid');
    $(document.body).on('click', `[rid=${this._rid}]`, this.onClick);

    let $scope = this.$scope,
        $element = tElement,
        $attrs = { },
        navBarCtrl = $scope.$ionicNavBar;
    $(this).on('$preLink', () => {
        // only register the plain HTML, the navBarCtrl takes care of scope/compile/link

        var parentViewCtrl = $element.parent().data('$ionViewController');
        if (parentViewCtrl) {
            // if the parent is an ion-view, then these are ion-nav-buttons for JUST this ion-view
            parentViewCtrl.navElement(navElementType, spanEle.outerHTML);

        } else {
            // these are buttons for all views that do not have their own ion-nav-buttons
            navBarCtrl.navElement(navElementType, spanEle.outerHTML);
        }

        spanEle = null;
    });
});

Template.ionNavButtons.onDestroyed(function() {
    $(document.body).off('click', `[rid=${this._rid}]`, this.onClick);
});