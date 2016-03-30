Template.ionNavTitle.onCreated(function() {
    
});

Template.ionNavTitle.onRendered(function() {
    let tElement = jqLite(this.firstNode),
        tAttrs = {};
    var navElementType = 'title';
    var spanEle = $document[0].createElement('span');
    for (var n in tAttrs.$attr) {
        spanEle.setAttribute(tAttrs.$attr[n], tAttrs[n]);
    }
    spanEle.classList.add('nav-bar-title');
    spanEle.innerHTML = tElement.html();

    tElement.attr('class', 'hide');
    tElement.empty();

    jqLite(spanEle); // Attach id.

    let $scope = this.$scope,
        $element = tElement,
        $attrs = {},
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