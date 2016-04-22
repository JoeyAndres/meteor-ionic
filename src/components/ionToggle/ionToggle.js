/**
 * @ngdoc directive
 * @name ionToggle
 * @module meteoric
 * @demo /toggle
 * @restrict E
 *
 * @description
 * A toggle is an animated switch which binds a given model to a boolean.
 *
 * Allows dragging of the switch's nub.
 *
 * The toggle behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]) otherwise.
 *
 * @param toggle-class {string=} Sets the CSS class on the inner `label.toggle` element created by the directive.
 *
 * @usage
 * Below is an example of a toggle directive which is wired up to the `airplaneMode` model
 * and has the `toggle-calm` CSS class assigned to the inner element.
 *
 * ```html
 {{#ionToggle toggleClass="toggle-calm"}}Checkbox Example{{/ionToggle}}
 * ```
 */


Template.ionToggle.helpers({
    inputAttrs() {
        var attrs = {};

        if (this.name) {
            attrs.name = this.name;
        } else {
            attrs.name = '';
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
    },

    toggleClass() {
        let td = Template.currentData();
        let toggleClass = '';

        if (!!td && !!td.toggleClass) {
            toggleClass += td.toggleClass;
        }

        toggleClass += ' toggle-' + $ionicConfig.form.toggle();

        return toggleClass;
    }
});
