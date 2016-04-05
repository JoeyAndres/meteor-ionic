var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    vinylPaths = require('vinyl-paths');
var runSequence = require('run-sequence');
var Dgeni = require('dgeni');

var paths = {
    js: ['./components/**/*.js'],
    templates: ['./components/**/*.html']
};

gulp.task('dgeni-clean', function() {
    gulp.src('./doc-build/**/*')
        .pipe(vinylPaths(del));
});

gulp.task('dgeni-migrate-materialize-dist', ['dgeni-clean'], function() {
    gulp.src('./node_modules/materialize-css/dist/**/*')
        .pipe(gulp.dest(path.resolve(__dirname, './doc-build/public')));
});

gulp.task('dgeni', ['dgeni-migrate-materialize-dist'], function() {
    var dgeni = new Dgeni([require('./.docs/dgeni-meteoric')({
        dest: './doc-build'
    })]);
    return dgeni.generate();
});

gulp.task('doc', ['dgeni'], function() { });

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['doc']);
    gulp.watch(paths.templates, ['doc']);
});

gulp.task('default', ['doc', 'watchers']);