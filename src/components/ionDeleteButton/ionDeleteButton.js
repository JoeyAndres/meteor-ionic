/**
 * @ngdoc directive
 * @name ionDeleteButton
 * @parent meteoric.directive:ionItem
 * @module meteoric
 * @restrict E
 * @description
 * Creates a delete button inside a list item, that is visible when the
 * {@link meteoric.directive:ionList ionList parent's} `showDelete` evaluates to true or
 * `$ionicListDelegate.showDelete(true)` is called.
 *
 * Takes any ionicon as a class.
 *
 * See {@link meteoric.directive:ionList} for a complete example & explanation.
 */
import { _ } from 'meteor/underscore';

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

    //Add the classes we need during the compile phase, so that they stay
    //even if something else like ngIf removes the element and re-addss it
    $(this).on('$postLink', () => {
        let self = this,
            $scope = this.$scope,
            $element = jqLite(this.firstNode),
            $attr = {
                onClick: function() {
                    stopPropagation.apply(this, arguments);
                    self.onClick.get().apply(this, arguments);
                }
            };

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

Template.ionDeleteButton.onRendered(function() {
    // Due to require: ['^^ionItem, ...], throw an error, if parent is not ionItem.
    this.assertParent(Template.ionItem);
});