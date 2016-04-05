var path = require('path'),
    gulp = require('gulp');
const spawn = require('child_process').spawn;

var paths = {
    js: ['./components/**/*.js'],
    templates: ['./components/**/*.html']
};

gulp.task('jsdoc', function() {
    const ls = spawn('./node_modules/.bin/jsdoc', ['-r', '-c', '.jsdoc.conf.json']);
    console.log('jsdoc parsing...');

    ls.on('close', (code) => {
        console.log(`jsdoc process exited with code ${code}`);
    });
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['jsdoc']);
    gulp.watch(paths.templates, ['jsdoc']);
});

gulp.task('default', ['jsdoc', 'watchers']);