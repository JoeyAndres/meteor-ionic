var ITEM_TPL_REORDER_BUTTON =
    '<div data-prevent-scroll="true" class="item-right-edit item-reorder enable-pointer-events">' +
    '</div>';

Template.ionReorderButton.onCreated(function() {
    this.onReorder = new ReactiveVar(noop);
    this.onClick = new ReactiveVar(noop);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.onReorder.set(isDefined(td.onReorder) ? td.onReorder : noop);
        this.onClick.set(isDefined(td.onClick) ? td.onClick : noop);
    });
});

Template.ionReorderButton.onRendered(function() {
    let self = this,
        $element = jqLite(this.firstNode),
        $scope = this.$scope,
        $attr = {
            onReorder: function() { self.onReorder.get().apply(this, arguments) },
            onClick: function() { self.onClick.get().apply(this, arguments) }
        };
    $element[0].setAttribute('data-prevent-scroll', true);

    $(this).on('$postLink', () => {
        var itemCtrl = $scope.$itemCtrl;
        var listCtrl = $scope.$listController;
        var onReorderFn = $attr.onReorder;

        $scope.$onReorder = function(oldIndex, newIndex) {
            onReorderFn($scope, {
                $fromIndex: oldIndex,
                $toIndex: newIndex
            });
        };

        //Don't bubble click up to main .item
        $element.on('click', $attr.onClick);

        // prevent clicks from bubbling up to the item
        if (!$attr.onClick) {
            $element[0].onclick = function(e) {
                e.stopPropagation();
                return false;
            };
        }

        var container = jqLite(ITEM_TPL_REORDER_BUTTON);
        container.append($element);
        itemCtrl.$element.append(container).addClass('item-right-editable');

        if (listCtrl && listCtrl.showReorder()) {
            container.addClass('visible active');
        }
    });
});