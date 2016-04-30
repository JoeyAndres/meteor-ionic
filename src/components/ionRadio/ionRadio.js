/**
 * @ngdoc directive
 * @name ionRadio
 * @module meteoric
 * @restrict E
 * @demo /radio
 * @description
 * The radio directive is no different than the HTML radio input, except it's styled differently.
 *
 * @usage
 *
 * Suppose you have a template with an multiple `ionRadio` in it:
 *
 * ```handlebars
 <template name="radio">
     {{#ionView title="Radio"}}
         {{#ionContent}}
             <form name="radio_button_form" id="radio-button-form">
                 {{#ionRadio name="test_radio" checked=true value="test value 1" model=radioModel }}
                     Test Content 1
                 {{/ionRadio}}
                 {{#ionRadio name="test_radio" value="test value 2" model=radioModel }}
                     Test Content 2
                 {{/ionRadio}}
                 {{#ionRadio name="test_radio" value="test value 3" model=radioModel }}
                     Test Content 3
                 {{/ionRadio}}

                 <div class="item item-icon-left">
                     <i class="ion-android-alert icon"></i> Model Value: <b id="model-value">{{radioModel_value}}</b>
                 </div>
             </form>
         {{/ionContent}}
     {{/ionView}}
 </template>
 * ```
 *
 * To provide the model and other data, in your javascript:
 * ```javascript
 Template.radio.onCreated(function() {
    this.radioModel = new ReactiveVar(null);
 });

 Template.radio.helpers({
    radioModel() {
        return Template.instance().radioModel;
    },

    radioModel_value() {
        return Template.instance().radioModel.get();
    }
 });
 * ```
 *
 * @param {ReactiveVar=} model Data to bind value to.
 * @param {string=} name The name of the radio input.
 * @param {expression=} value The value of the radio input.
 * @param {boolean=} disabled The state of the radio input.
 * @param {string=} icon The icon to use when the radio input is selected.
 */
Template.ionRadio.onRendered(function() {
    let data = this.data;
    let model = !!data && data.model;
    let $checkbox = this.$('input[type="radio"]');

    let modelValue = (initialValue) => {
        let checked = isDefined(initialValue) ? initialValue : $checkbox.is(':checked');
        if (checked) {
            let valueExist = isDefined(data) && isDefined(data.value);
            return valueExist ? data.value : true;
        }

        return undefined;
    };

    if (model) {
        let initialValue = !!data && !!data.checked;
        let value = modelValue(initialValue);
        if (isDefined(value)) {
            model.set(value);
        }
        $checkbox.prop('checked', initialValue);

        this.$(':radio').change(e => {
            let value = modelValue();
            if (isDefined(value)) {
                model.set(value);
            }
        });
    }
});

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
});
