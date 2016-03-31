var ITEM_TPL_DELETE_BUTTON =
    '<div class="item-left-edit item-delete enable-pointer-events">' +
    '</div>';

function stopPropagation(e) {
    e.stopPropagation();
}

Template.ionDeleteButton.onCreated(function() {
    this.onClick = new ReactiveVar(noop);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.onClick.set(isDefined(td.onClick) ? td.onClick : noop);
    });
});

Template.ionDeleteButton.onRendered(function() {
    let self = this,
        $scope = this.$scope,
        $element = jqLite(this.firstNode),
        $attr = {
            onClick: function() {
                stopPropagation.apply(this, arguments);
                self.onClick.get().apply(this, arguments);
            }
        };

    //Add the classes we need during the compile phase, so that they stay
    //even if something else like ngIf removes the element and re-addss it
    $(this).on('$postLink', () => {
        var itemCtrl = $scope.$itemCtrl;
        var listCtrl = $scope.$listController;
        var container = jqLite(ITEM_TPL_DELETE_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-left-editable');

        //Don't bubble click up to main .item
        $element.on('click', $attr.onClick);

        init();
        $scope.$on('$ionic.reconnectScope', init);
        function init() {
            listCtrl = listCtrl || $element.controller('ionList');
            if (listCtrl && listCtrl.showDelete()) {
                container.addClass('visible active');
            }
        }
    });
});