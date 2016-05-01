var marked_materialize = require('./marked-materialize-css'),
    hljs = require('highlight.js'),
    marked = require('marked');

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

module.exports = function renderMarkdown(trimIndentation) {
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
};