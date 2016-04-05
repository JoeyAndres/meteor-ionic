/**
 * @ngdoc directive
 * @name ionRadio
 * @module meteoric
 * @restrict E
 * @codepen saoBG
 * @description
 * The radio directive is no different than the HTML radio input, except it's styled differently.
 *
 * Radio behaves like [AngularJS radio](http://docs.angularjs.org/api/ng/input/input[radio]).
 *
 * @usage
 * ```html
 * <ion-radio ng-model="choice" ng-value="'A'">Choose A</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'B'">Choose B</ion-radio>
 * <ion-radio ng-model="choice" ng-value="'C'">Choose C</ion-radio>
 * ```
 *
 * @param {string=} name The name of the radio input.
 * @param {expression=} value The value of the radio input.
 * @param {boolean=} disabled The state of the radio input.
 * @param {string=} icon The icon to use when the radio input is selected.
 * @param {expression=} ng-value Angular equivalent of the value attribute.
 * @param {expression=} ng-model The angular model for the radio input.
 * @param {boolean=} ng-disabled Angular equivalent of the disabled attribute.
 * @param {expression=} ng-change Triggers given expression when radio input's model changes
 */
Template.ionRadio.helpers({
  inputAttrs: function () {
    var attrs = {
      type: 'radio'
    };

    if (this.name) {
      attrs.name = this.name;
    } else {
      attrs.name = 'radio-group';
    }

    if (this.value) {
      attrs.value = this.value;
    } else {
      attrs.value = '';
    }

    if (this.disabled) {
      attrs.disabled = true;
    }

    if (this.checked) {
      attrs.checked = true;
    }

    return attrs;
  }
})
