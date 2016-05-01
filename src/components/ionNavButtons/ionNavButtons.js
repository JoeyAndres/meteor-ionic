/**
 * @ngdoc directive
 * @name ionNavButtons
 * @module meteoric
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * Use nav buttons to set the buttons on your {@link meteoric.directive:ionNavBar}
 * from within an {@link meteoric.directive:ionView}. This gives each
 * view template the ability to specify which buttons should show in the nav bar,
 * overriding any default buttons already placed in the nav bar.
 *
 * Any buttons you declare will be positioned on the navbar's corresponding side. Primary
 * buttons generally map to the left side of the header, and secondary buttons are
 * generally on the right side. However, their exact locations are platform-specific.
 * For example, in iOS, the primary buttons are on the far left of the header, and
 * secondary buttons are on the far right, with the header title centered between them.
 * For Android, however, both groups of buttons are on the far right of the header,
 * with the header title aligned left.
 *
 * We recommend always using `primary` and `secondary`, so the buttons correctly map
 * to the side familiar to users of each platform. However, in cases where buttons should
 * always be on an exact side, both `left` and `right` sides are still available. For
 * example, a toggle button for a left side menu should be on the left side; in this case,
 * we'd recommend using `side="left"`, so it's always on the left, no matter the platform.
 *
 * ***Note*** that `ionNavButtons` must be immediate descendants of the `ionView` or
 * `ionNavBar` element (basically, don't wrap it in another div).
 *
 * @usage
 * ```handlebars
 {{#ionView title="ionNavButtons Example"}}
     {{#ionNavButtons side="left"}}
         <button class="button button-clear pull-left" ion-menu-toggle="left">
             <i class="icon ion-navicon"></i>
         </button>
     {{/ionNavButtons}}
     {{#ionNavButtons side="right"}}
         <button class="button button-clear pull-right" ion-menu-toggle="right">
             <i class="icon ion-navicon"></i>
         </button>
     {{/ionNavButtons}}

     {{#ionContent}}
         <!-- Stuff and what not -->
     {{/ionContent}}
 {{/ionView}}
 * ```
 *
 * @param {string} side The side to place the buttons in the
 * {@link meteoric.directive:ionNavBar}. Available sides: `primary`, `secondary`, `left`, and `right`.
 */

Template.ionNavButtons.onCreated(function() {
    this.side = isDefined(this.data) ? this.data.side : 'left';
    this.onClick = isDefined(this.data.onClick) ? this.data.onClick : noop;

    this._rid = null;
});

Template.ionNavButtons.onRendered(function() {
    this.assertParent([Template.ionView, Template.ionNavBar]);

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