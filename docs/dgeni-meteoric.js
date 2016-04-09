// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
var path = require('canonical-path'),
    marked = require('marked'),
    hljs = require('highlight.js'),
    marked_materialize = require('./lib/marked-materialize-css');

var Dgeni = require('dgeni');
var Package = Dgeni.Package;

marked.setOptions({
    highlight: function (code, lang) {
        if (lang) {
            try {
                return hljs.highlight(lang, code).value;
            } catch (error) {
                return code;
            }
        } else {
            return hljs.highlightAuto(code).value;
        }
    }
});

// Create and export a new Dgeni package called dgeni-meteoric. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = function(config) {
    var dgeniMeteoric =new Package('dgeni-meteoric', [
        require('dgeni-packages/ngdoc'),
        require('dgeni-packages/nunjucks'),
        require('dgeni-packages/jsdoc')
    ]);

    var dgeni = new Dgeni([dgeniMeteoric]);
    var injector = dgeni.configureInjector();
    var trimIndentation = injector.get('trimIndentation');

    var renderMarkdown = (function (trimIndentation) {
        var renderer = new marked.Renderer();

        marked_materialize(renderer);

        // remove the leading whitespace from the code block before it gets to the
        // markdown code render function
        renderer.code = function(code, string, language) {

            var trimmedCode = trimIndentation(code);
            var renderedCode = marked.Renderer.prototype.code.call(this, trimmedCode, string, language);

            // Bug in marked - forgets to add a final newline sometimes
            if ( !/\n$/.test(renderedCode) ) {
                renderedCode += '\n';
            }

            return renderedCode;
        };

        return function(content) {
            return marked(content, { renderer: renderer });
        };
    })(trimIndentation);

    // Configure our dgeni-example package. We can ask the Dgeni dependency injector
    // to provide us with access to services and processors that we wish to configure
    dgeniMeteoric
        .factory(require('./inline-tag-defs/link'))
        .config(function(log,
                         readFilesProcessor,
                         templateFinder,
                         writeFilesProcessor,

                         linkInlineTagDef,
                         inlineTagProcessor,
                         parseTagsProcessor,
                         markedNunjucksFilter) {
            markedNunjucksFilter.process = function (str) {
                var output = str && renderMarkdown(str);

                // Due to double/triple curly braces being special to meteor yet marked.js won't
                // parse and transform it, we need to convert them to html entity characters ourselves.
                output = output.replace(/{{/g, '&#123;&#123;');
                output = output.replace(/{{{/g, '&#123;&#123;&#123;');
                output = output.replace(/}}/g, '&#125;&#125;');
                output = output.replace(/}}}/g, '&#125;&#125;&#125;');

                return output;
            };

            inlineTagProcessor.inlineTagDefinitions = [linkInlineTagDef];
            // inlineTagProcessor.inlineTagDefinitions.splice(0, 1, require('./inline-tag-defs/link'));
            for(var tagDef of require('./tag-defs')) {
                parseTagsProcessor.tagDefinitions.unshift(tagDef);
            }

            // Set logging level
            log.level = 'warning';

            // Specify the base path used when resolving relative paths to source and output files
            readFilesProcessor.basePath = path.resolve(__dirname, '..');

            // Specify collections of source files that should contain the documentation to extract
            readFilesProcessor.sourceFiles = [
                {
                    // Process all js files in `src` and its subfolders ...
                    include: config.src
                    // When calculating the relative path to these files use this as the base path.
                    // So `src/foo/bar.js` will have relative path of `foo/bar.js`
                }
            ];

            // Add a folder to search for our own templates to use when rendering docs
            templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

            // Specify where the writeFilesProcessor will write our generated doc files
            writeFilesProcessor.outputFolder = config.dest;
        });

    return dgeniMeteoric;
};