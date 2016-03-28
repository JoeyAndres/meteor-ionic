Template.ionFooterBar.onCreated(function() {
  this.alignTitle = this.data? this.data.alignTitle : null;
  this.class = new ReactiveVar('');
  this.hide = new ReactiveVar(false);

  this.autorun(() => {
    let td = Template.currentData();
    if (!td) return;

    this.class.set(td.class ? td.class : '');
  });
});

Template.ionFooterBar.onRendered(function () {
  let isHeader = false;
  headerFooterBarDirective.call(this, isHeader);
});
