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

Template.ionCheckbox.helpers({
    inputAttrs: function () {
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
    }
});
