var renderMarkdown = require('./../../lib/render-markdown');

module.exports = function(trimIndentation, encodeCodeBlock) {
    return {
        tags: ['code'],

        parse: function(parser, nodes) {
            var tok = parser.nextToken();
            var args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(tok.value);

            var content = parser.parseUntilBlocks("endcode");
            var tag = new nodes.CallExtension(this, 'process', args, [content]);
            parser.advanceAfterBlockEnd();

            return tag;
        },

        process: function(context, lang, content) {
            if ( !content ) {
                content = lang;
                lang = undefined;
            }
            var trimmedString = trimIndentation(content());
            var codeString = renderMarkdown(trimIndentation)(trimmedString);
            //var codeString = encodeCodeBlock(trimmedString, false, lang);
            
            codeString = codeString.replace(/{{/g, '&#123;&#123;');
            codeString = codeString.replace(/{{{/g, '&#123;&#123;&#123;');
            codeString = codeString.replace(/}}/g, '&#125;&#125;');
            codeString = codeString.replace(/}}}/g, '&#125;&#125;&#125;');
            
            return codeString;
        }
    };
};