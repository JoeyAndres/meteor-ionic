Meteor.startup(function() {
    if (Package['fastclick']) {
        console.error("Error: 'fastclick' package exist in your project, this conflicts with 'meteoric tap'.");

        if (Meteor.isServer) {
            process.exit(8192);
        }
    }
});