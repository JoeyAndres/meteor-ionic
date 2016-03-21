Template.ionView.onCreated(function() {
    this.entering = false;
    this.leaving = false;

    this.activate_view_timeout_id = null;
    this.deactivate_view_timeout_id = null;
});

Template.ionView.onRendered(function () {
    this.$scope.$emit('$stateChangeSuccess');  // todo: Find a way for iron:router to generate this.
});

Template.ionView.helpers({
    title: function () {
        if ( Template.instance().data && Template.instance().data.title ) {
            return Template.instance().data.title;
        }
    }
});