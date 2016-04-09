/**
 * @ngdoc directive
 * @name ionReorderButton
 * @parent meteoric.directive:ionItem
 * @module meteoric
 * @restrict E
 * Creates a reorder button inside a list item, that is visible when the
 * {@link meteoric.directive:ionList ionList parent's} `show-reorder` evaluates to true or
 * `$ionicListDelegate.showReorder(true)` is called.
 *
 * Can be dragged to reorder items in the list. Takes any ionicon class.
 *
 * Note: Reordering works best when used with `ng-repeat`.  Be sure that all `ion-item` children of an `ion-list` are part of the same `ng-repeat` expression.
 *
 * When an item reorder is complete, the expression given in the `on-reorder` attribute is called. The `on-reorder` expression is given two locals that can be used: `$fromIndex` and `$toIndex`.  See below for an example.
 *
 * Look at {@link meteoric.directive:ionList} for more examples.
 *
 * @usage
 *
 * ```html
 * <ion-list ng-controller="MyCtrl" show-reorder="true">
 *   <ion-item ng-repeat="item in items">
 *     Item {{item}}
 *     <ion-reorder-button class="ion-navicon"
 *                         on-reorder="moveItem(item, $fromIndex, $toIndex)">
 *     </ion-reorder-button>
 *   </ion-item>
 * </ion-list>
 * ```
 * ```js
 * function MyCtrl($scope) {
*   $scope.items = [1, 2, 3, 4];
*   $scope.moveItem = function(item, fromIndex, toIndex) {
*     //Move the item in the array
*     $scope.items.splice(fromIndex, 1);
*     $scope.items.splice(toIndex, 0, item);
*   };
* }
 * ```
 *
 * @param {expression=} on-reorder Expression to call when an item is reordered.
 * Parameters given: $fromIndex, $toIndex.
 */

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

    $(this).on('$postLink', () => {
        let self = this,
            $element = jqLite(this.firstNode),
            $scope = this.$scope,
            $attr = {
                onReorder: function() { self.onReorder.get().apply(this, arguments) },
                onClick: function() { self.onClick.get().apply(this, arguments) }
            };
        
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

Template.ionReorderButton.onRendered(function() {
    let self = this,
        $element = jqLite(this.firstNode),
        $scope = this.$scope,
        $attr = {
            onReorder: function() { self.onReorder.get().apply(this, arguments) },
            onClick: function() { self.onClick.get().apply(this, arguments) }
        };
    $element[0].setAttribute('data-prevent-scroll', true);
});