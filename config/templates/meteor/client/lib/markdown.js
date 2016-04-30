let renderer = new marked.Renderer();
renderer.blockquote = function (quote) {
    return `<blockquote>${quote}</blockquote>`;
};
renderer.list = function (body, ordered) {
    if (!ordered) {
        return `<ul class='collection'>${body}</ul>`;
    } else {
        return `<ol class='collection'>${body}</ol>`;
    }
};
renderer.listitem = function (text) {
    return `<li class='collection-item'>${text}</li>`;
};
renderer.paragraph = function (text) {
    return `<p class='flow-text'>${text}</p>`;
};

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    highlight: function (code) { return hljs.highlightAuto(code).value; }
});