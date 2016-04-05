var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths');
var Dgeni = require('dgeni');

var paths = {
    js: ['./components/**/*.js'],
    templates: ['./components/**/*.html']
};

gulp.task('dgeni', function() {
    gulp.src('./doc-build/*')
        .pipe(vinylPaths(del));
    var dgeni = new Dgeni([require('./.docs/dgeni-meteoric')({
        dest: 'doc-build'
    })]);
    return dgeni.generate();
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['dgeni']);
    gulp.watch(paths.templates, ['dgeni']);
});

gulp.task('default', ['dgeni', 'watchers']);