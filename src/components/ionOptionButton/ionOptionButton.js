/**
 * @ngdoc directive
 * @name ionOptionButton
 * @parent meteoric.directive:ionItem
 * @module meteoric
 * @restrict E
 * @description
 * Creates an option button inside a list item, that is visible when the item is swiped
 * to the left by the user.  Swiped open option buttons can be hidden with
 * {@link meteoric.service:$ionicListDelegate#closeOptionButtons $ionicListDelegate.closeOptionButtons}.
 *
 * Can be assigned any button class.
 *
 * See {@link meteoric.directive:ionList} for a complete example & explanation.
 *
 * @usage
 *
 * ```handlebars
 * {{#ionList}}
 *   {{#ionItem}}
 *     I love kittens!
 *     {{#ion-option-button class="button-positive"}}Share{{/ion-option-button}}
 *     {{#ion-option-button class="button-assertive"}}Edit{{/ion-option-button}}
 *   {{/ion-item}}
 * {{/ionList}}
 * ```
 */

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

    $(this).on('$postLink', () => {
        let self = this,
            $element = jqLite(this.firstNode),
            $attr = {
                onClick: function() {
                    stopPropagation.apply(this, arguments);
                    self.onClick.get().apply(this, arguments);
                }
            };
        
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

Template.ionOptionButton.onRendered(function () {
    let self = this,
        $element = jqLite(this.firstNode),
        $attr = {
            onClick: function() {
                stopPropagation.apply(this, arguments);
                self.onClick.get().apply(this, arguments);
            }
        };
    $element.toggleClass('button', true);
    $attr.class = $element.attr('class');
});