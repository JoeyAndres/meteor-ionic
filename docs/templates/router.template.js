Router.map(function() {
    <% _.forEach(modules, function(module) { %>
        this.route("<%= module %>");
    <% }); %>
});