/**
 * @function ionSideMenu
 *
 * @description
 * A container for a side menu, sibling to an {@link ionic.directive:ionSideMenuContent} directive.
 *
 * ```html
 * <ion-side-menu
 *   side="left"
 *   width="myWidthValue + 20"
 *   is-enabled="shouldLeftSideMenuBeEnabled()">
 * </ion-side-menu>
 * ```
 * For a complete side menu example, see the
 * {@link ionic.directive:ionSideMenus} documentation.
 *
 * @param {string} side Which side the side menu is currently on.  Allowed values: 'left' or 'right'.
 * @param {boolean=} is-enabled Whether this side menu is enabled.
 * @param {number=} width How many pixels wide the side menu should be.  Defaults to 275.
 */
Template.ionSideMenu.onCreated(function() {
    this.new_scope = true;

    this.side = (this.data && this.data.side) || 'left';
    this.isEnabled = new ReactiveVar(true);
    this.width = new ReactiveVar(275);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;
        this.isEnabled.set(isDefined(td.isEnabled) ? td.isEnabled : true);
        this.width.set(_.isNumber(td.width) ? td.width : 275);
    });
});

Template.ionSideMenu.onRendered(function() {
    let $scope = this.$scope, 
        $element = jqLite(this.firstNode), 
        $attr = {
            side: this.side,
            isEnabled: this.isEnabled.get(),
            width: this.width.get()
        };
    
    _.isUndefined($attr.isEnabled) && $element.attr('isEnabled', 'true');
    _.isUndefined($attr.width) && $element.attr('width', '275');

    $element.toggleClass('menu menu-' + $attr.side, true);

    $(this).on('$postLink', () => {
        let sideMenuCtrl = $scope.$parent.$sideMenuCtrl;
        $scope.side = $attr.side || 'left';

        var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
            width: $attr.width,
            el: $element[0],
            isEnabled: true
        });

        this.autorun(() => {
            let val = this.width.get();
            var numberVal = +val;
            if (numberVal && numberVal == val) {
                sideMenu.setWidth(+val);
            }
        });

        this.autorun(() => {
            let val = this.isEnabled.get();
            sideMenu.setIsEnabled(!!val);
        });
    });
});