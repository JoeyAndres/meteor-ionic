Template.ionHeaderBar.onCreated(function() {
    this.alignTitle = this.data? this.data.alignTitle : null;
    this.class = new ReactiveVar('');
    this.hide = new ReactiveVar(false);

    this.autorun(() => {
        let td = Template.currentData();
        if (!td) return;

        this.class.set(td.class);
    });
});

Template.ionHeaderBar.onRendered(function () {
    let isHeader = true;
    headerFooterBarDirective.call(this, isHeader);
});