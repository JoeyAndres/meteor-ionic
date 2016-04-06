var path = require('path'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    del = require('del'),
    es = require('event-stream'),
    _ = require('underscore'),
    template = require('gulp-template');
var runSequence = require('run-sequence');
var Dgeni = require('dgeni');

var paths = {
    js: ['./src/components/**/*.js'],
    templates: ['./src/components/**/*.html'],
    docStyles: ['./docs/styles/**/*.scss']
};

gulp.task('dgeni-clean', function() {
    return del('./doc-build');
});

gulp.task('migrate-materialize-dist', function() {
    return gulp.src('node_modules/materialize-css/dist/**/*')
        .pipe(gulp.dest(path.resolve(__dirname, './doc-build/public/materialize')));
});

gulp.task('dgeni', ['dgeni-clean'], function(done) {
    var dgeni = new Dgeni([require('./docs/dgeni-meteoric')({
        src: paths.js,
        dest: './doc-build'
    })]);
    return new Promise(function(resolve) {
        dgeni.generate().then(function() { resolve(); });
    });
});

gulp.task('doc-styles', function() {
    return gulp.src('docs/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./doc-build/public/css'));
});

gulp.task('doc-side-nav', function() {
    var docPath = './doc-build/partials/api';
    var modules = [];

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
                path: '/meteor-ionic/doc-build/partials/api/' + m,
                segmented: m.split('.html')[0].split('/')
            };
            return m;
        });

        var main_modules = _.union(modules.map(function(m) {
            return m.segmented[1];
        })).map(function(m) {
            var childModules = modules.filter(function(m2) {
                return m2.segmented[1] == m;
            });
            var new_m = {
                name: m,
                path:  childModules[0].path,
                childModules: childModules
            };
            return new_m;
        });

        return gulp.src('docs/templates/sidenav.template.html')
            .pipe(template({main_modules: main_modules}))
            .pipe(gulp.dest('docs/templates/temp'));
    });
});

gulp.task('doc', function() {
    runSequence(
        'dgeni',
        'doc-side-nav',
        'dgeni',
        'migrate-materialize-dist',
        'doc-styles');
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['doc']);
    gulp.watch(paths.templates, ['doc']);
    gulp.watch(paths.docStyles, ['doc']);
});

gulp.task('default', ['watchers']);