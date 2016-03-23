Template.ionSpinner.onCreated(function() {
  this.icon = new ReactiveVar(null);

  this.autorun(() => {
    if (!Template.currentData()) return;  // If no data-context, don't do a thing.
    this.icon.set(!!Template.currentData().icon ? Template.currentData().icon : null);
  });
});

Template.ionSpinner.onRendered(function() {
  let $element = this.$(this.firstNode);

  $(this).on('$postLink', () => {
    this.icon.set((new meteoric.controller.ionicSpinner($element, {
      icon: this.icon.get()
    })).init());
  });
});

Template.ionSpinner.helpers({
  icon: function() {
    return Template.instance().icon.get();
  }
});
