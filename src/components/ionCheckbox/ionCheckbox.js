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
        let initialValue = !!data && !!data.value;
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
