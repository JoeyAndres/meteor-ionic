Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    <% _.forEach(modules, function(module) {
        var templateName = module;
        var routePath = /^(?:DocPage)(.+)$/g.exec(module.trim())[1];
        %>
        this.route("<%= templateName %>", {
            path: "/docs/<%= routePath %>",
            template: "<%= templateName %>"
        });
    <% }); %>

    this.route('Home', {
        path: '/',
        action() {
            this.redirect('<%= modules[0] %>');
        }
    });

    // Go to the first module.
    this.route('DocPageIndex', function() {
        this.redirect('<%= modules[0] %>');
    });

    this.route('About', {
        path: '/about/',
        template: 'About'
    });
});