var path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    vinylPaths = require('vinyl-paths'),
    es = require('event-stream'),
    _ = require('underscore'),
    template = require('gulp-template');

var runSequence = require('run-sequence');
var Dgeni = require('dgeni');

var paths = {
    js: ['./components/**/*.js'],
    templates: ['./components/**/*.html'],
    docStyles: ['./docs/styles/**/*.scss']
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

gulp.task('doc-styles', function() {
    return gulp.src('./.docs/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./doc-build/public/css'));
});

gulp.task('doc', ['dgeni', 'doc-styles'], function() {
    var docPath = './doc-build/partials/api';
    var modules = [];
    var through2 = require('through2');

    function synchro (done) {
        return through2.obj(function (data, enc, cb) {
                cb();
            },
            function (cb) {
                cb();
                done();
            });
    }
    return gulp.src([
        docPath + '/meteoric/{directive,object,service}/**/*.{md,html,markdown}'
    ]).pipe(es.map(function(file, callback) {
        // Grab relative path from ionic-site root
        var relpath = file.path.replace(RegExp('^.*?' + docPath + '/'), '');
        modules.push(relpath);

        callback();
    })).on('end', function() {
        modules = modules.map(function(m) {
            // get rid of .html,
            m = {
                path: m,
                segmented: m.split('.html')[0].split('/')
            };
            return m;
        });

        var main_modules = _.union(modules.map(function(m) {
            return m.segmented[1];
        })).map(function(m) {
            m = {
                name: m,
                childModules: modules.filter(function(m2) {
                    return m2.segmented[1] == m;
                })
            };
            return m;
        });

        gulp.src('./.docs/templates/sidenav.template.html')
            .pipe(template({main_modules: main_modules}))
            .pipe(gulp.dest('.docs/templates/temp'));
    });
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['doc']);
    gulp.watch(paths.templates, ['doc']);
    gulp.watch(paths.docStyles, ['doc']);
});

gulp.task('default', ['doc', 'watchers']);