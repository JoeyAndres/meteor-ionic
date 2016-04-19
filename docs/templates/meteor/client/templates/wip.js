Template.wip.helpers({
    feature: function() {
        let words = Router.current().url.split('/');
        let non_empty_words = words.filter(w => w.length > 0);
        return non_empty_words[non_empty_words.length - 1];
    }
});