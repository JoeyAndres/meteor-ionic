/**
 * @ngdoc directive
 * @name ionNavTitle
 * @module meteoric
 * @restrict E
 * @parent ionNavView
 *
 * @description
 *
 * The nav title directive replaces an {@link meteoric.directive:ionNavBar} title text with
 * custom HTML from within an {@link meteoric.directive:ionView} template. This gives each
 * view the ability to specify its own custom title element, such as an image or any HTML,
 * rather than being text-only. Alternatively, text-only titles can be updated using the
 * `viewTitle` {@link meteoric.directive:ionView} attribute.
 *
 * Note that `ionNavTitle` must be an immediate descendant of the `ionView` or
 * `ionNavBar` element (basically don't wrap it in another div).
 *
 * @usage
 * ```handlebars
 {{#ionView viewTitle="Facts"}}
     {{#ionNavTitle}}Hello{{/ionNavTitle}}
     {{#ionContent class="padding"}}
         {{> tabContentWrapper}}
     {{/ionContent}}
 {{/ionView}}
 * ```
 *
 */

Template.ionNavTitle.onCreated(function() {
    
});

Template.ionNavTitle.onRendered(function() {
    this.assertParent([Template.ionView, Template.ionNavBar]);

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
            // if the parent is an ionView, then these are ionNavButtons for JUST this ionView
            parentViewCtrl.navElement(navElementType, spanEle.outerHTML);

        } else {
            // these are buttons for all views that do not have their own ionNavButtons
            navBarCtrl.navElement(navElementType, spanEle.outerHTML);
        }

        spanEle = null;
    });
});