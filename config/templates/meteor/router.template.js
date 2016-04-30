Router.configure({
    layoutTemplate: 'layout',
    notFoundTemplate: 'wip'
});

Router.map(function() {
    this.route('Install', {
        path: '/install/',
        template: 'Install'
    });

    this.route('StarterProject', {
        path: '/starter-project/',
        template: 'StarterProject'
    });

    this.route('meteor-ionic to meteoric', {
        path: '/meteor-ionic-to-meteoric/',
        template: 'MeteorIonicToMeteoric'
    });

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
            this.redirect('/install');
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