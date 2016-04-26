/**
 * @ngdoc directive
 * @name ionCheckbox
 * @module meteoric
 * @demo /checkbox
 * @restrict E
 * @description
 * The checkbox is no different than the HTML checkbox input, except it's styled differently.
 *
 * The checkbox behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]).
 *
 * @param {ReactiveVar=} model Data to bind value to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} trueValue The value to which the model should be set when selected.
 * @param {expression=} falseValue The value to which the model should be set when not selected.
 * @param {boolean=} disabled The state of the radio input.
 *
 * @usage
 * ```handlebars
 {{#ionCheckbox}}Checkbox Example{{/ionCheckbox}}
 * ```
 */

Template.ionCheckbox.onRendered(function() {
    let data = this.data;
    let model = !!data && data.model;
    let $checkbox = this.$('input[type="checkbox"]');

    let modelValue = (initialValue) => {
        let checked = isDefined(initialValue) ? initialValue : $checkbox.is(':checked');
        if (checked) {
            let trueValueExist = isDefined(data) && isDefined(data.trueValue);
            return trueValueExist ? data.trueValue : true;
        } else {
            let falseValueExist = isDefined(data) && isDefined(data.falseValue);
            return falseValueExist ? data.falseValue : false;
        }
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

Template.ionCheckbox.helpers({
    inputAttrs() {
        var attrs = {};

        if (this.name) {
            attrs.name = this.name;
        } else {
            attrs.name = '';
        }

        if (this.disabled) {
            attrs.disabled = true;
        }

        if (this.checked) {
            attrs.checked = true;
        }

        return attrs;
    },

    checkboxClass() {
        return 'checkbox-' + $ionicConfig.form.checkbox();
    }
});
