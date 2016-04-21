Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'wip'
});

Router.map(function() {
    <% _.forEach(modules, function(module) {
        %>
        this.route("<%= module.routeName %>", {
            path: "<%= module.routePath %>",
            template: "<%= module.routeName %>"
        });
    <% }); %>

    this.route('Home', {
        path: '/',
        action() {
            this.redirect('<%= modules[0].routeName %>');
        }
    });

    // Go to the first module.
    this.route('DocPageIndex', function() {
        this.redirect('<%= modules[0].routeName %>');
    });

    this.route('About', {
        path: '/about/',
        template: 'About'
    });
});