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
 * TODO: Allows dragging of the switch's nub.
 *
 * @param toggle-class {string=} Sets the CSS class on the inner `label.toggle` element created by the directive.
 * @param {ReactiveVar=} model Data to bind value to.
 * @param {string=} name The name of the radio input.
 * @param {expression=} value The value of the radio input.
 * @param {boolean=} disabled The state of the radio input.
 *
 * @usage
 * Below is an example of a toggle directive which is wired up to the `airplaneMode` model
 * and has the `toggle-calm` CSS class assigned to the inner element.
 *
 * ```handlebars
 {{#ionToggle toggleClass="toggle-calm"}}Checkbox Example{{/ionToggle}}
 * ```
 */

Template.ionToggle.onRendered(function() {
    let data = this.data;
    let model = !!data && data.model;
    let $checkbox = this.$('input[type="checkbox"]');

    let modelValue = (initialValue) => {
        let checked = isDefined(initialValue) ? initialValue : $checkbox.is(':checked');
        if (checked) {
            let valueExist = isDefined(data) && isDefined(data.value);
            return valueExist ? data.value : true;
        }

        return false;
    };

    if (model) {
        let initialValue = !!data && !!data.checked;
        model.set(modelValue(initialValue));
        $checkbox.prop('checked', initialValue);

        this.$(':checkbox').change(e => {
            model.set(modelValue());
        });
    } else {
        $checkbox.checked('checked', false);
    }
});

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
