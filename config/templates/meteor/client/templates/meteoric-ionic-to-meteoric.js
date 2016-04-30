import { $ } from 'meteor/jquery';

Template.MeteorIonicToMeteoric.onCreated(function() {
    this.md_text = new ReactiveVar('');
    $.get('/meteoric-ionic-to-meteoric.md', {}, (data, textStatus, jqXHR) => {
        this.md_text.set(data);
    });
});

Template.MeteorIonicToMeteoric.helpers({
    md_text() {
        return marked(Template.instance().md_text.get());
    }
});