var ITEM_TPL_OPTION_BUTTONS =
    '<div class="item-options invisible">' +
    '</div>';

function stopPropagation(e) {
    e.stopPropagation();
}

Template.ionOptionButton.onCreated(function() {
    this.onClick = new ReactiveVar(noop);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.onClick.set(isDefined(td.onClick) ? td.onClick : noop);
    });
});

Template.ionOptionButton.onRendered(function () {
    let self = this,
        $element = jqLite(this.firstNode),
        $attr = {
            onClick: function() {
                //stopPropagation.apply(this, arguments);
                //self.onClick.get().apply(this, arguments);
            }
        };
    $element.toggleClass('button', true);
    $attr.class = $element.attr('class');

    $(this).on('$postLink', () => {
        let $scope = this.$scope,
            itemCtrl = $scope.$itemCtrl;

        if (!itemCtrl.optionsContainer) {
            itemCtrl.optionsContainer = jqLite(ITEM_TPL_OPTION_BUTTONS);
            itemCtrl.$element.append(itemCtrl.optionsContainer);
        }
        itemCtrl.optionsContainer.append($element);

        itemCtrl.$element.addClass('item-right-editable');

        //Don't bubble click up to main .item
        $element.on('click', $attr.onClick);
    });
});