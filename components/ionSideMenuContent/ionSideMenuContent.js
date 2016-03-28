Template.ionSideMenuContent.onCreated(function() {
  this.new_scope = true;
});

Template.ionSideMenuContent.helpers({
  classes: function () {
    var classes = ['menu-content', 'snap-content', 'pane'];
    return classes.join(' ');
  }
});
