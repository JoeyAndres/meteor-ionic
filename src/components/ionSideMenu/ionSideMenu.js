/**
 * @ngdoc directive
 * @name ionSideMenu
 * @module meteoric
 * @restrict E
 * @parent meteoric.directive:ionSideMenus
 *
 * @description
 * A container for a side menu, sibling to an {@link meteoric.directive:ionSideMenuContent} directive.
 *
 * ```handlebars
 {{#ionSideMenu}}
     <div class="bar bar-header bar-dark">
         <h1 class="title">Left Menu</h1>
     </div>
     <div class="content has-header">
         <div class="list">
             <div class="item item-icon-right" ion-menu-close>
                 Close Me <i class="icon ionic-ios-arrow-right"></i>
             </div>
         </div>
     </div>
 {{/ionSideMenu}}
 * ```
 * For a complete side menu example, see the
 * {@link meteoric.directive:ionSideMenus} documentation.
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