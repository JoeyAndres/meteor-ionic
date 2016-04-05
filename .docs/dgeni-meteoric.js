// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path');

var Package = require('dgeni').Package;

// Create and export a new Dgeni package called dgeni-meteoric. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = function(config) {
    var dgeniMeteoric =new Package('dgeni-meteoric', [
        require('dgeni-packages/ngdoc')
    ])

    // Configure our dgeni-example package. We can ask the Dgeni dependency injector
    // to provide us with access to services and processors that we wish to configure
        .config(function(log,
                         readFilesProcessor,
                         templateFinder,
                         writeFilesProcessor) {

            // Set logging level
            log.level = 'info';

            // Specify the base path used when resolving relative paths to source and output files
            readFilesProcessor.basePath = path.resolve(__dirname, '..');

            // Specify collections of source files that should contain the documentation to extract
            readFilesProcessor.sourceFiles = [
                {
                    // Process all js files in `src` and its subfolders ...
                    include: 'components/**/*.js'
                    // When calculating the relative path to these files use this as the base path.
                    // So `src/foo/bar.js` will have relative path of `foo/bar.js`
                }
            ];

            // Add a folder to search for our own templates to use when rendering docs
            templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

            // Specify where the writeFilesProcessor will write our generated doc files
            writeFilesProcessor.outputFolder  = config.dest;
        });

    return dgeniMeteoric;
};