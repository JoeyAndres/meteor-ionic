var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    es = require('event-stream'),
    _ = require('underscore'),
    template = require('gulp-template');
var runSequence = require('run-sequence');
var Dgeni = require('dgeni');
var exec = require('child_process').exec;
var insert = require('gulp-insert-lines');
var rename = require("gulp-rename");

var paths = {
    js: ['./src/components/**/*.js'],
    templates: ['./src/components/**/*.html'],
    docStyles: ['./docs/styles/**/*.scss']
};

gulp.task('dgeni-clean', function() {
    return del('./doc-build/client');
});

gulp.task('dgeni', ['dgeni-clean'], function(done) {
    var dgeni = new Dgeni([require('./docs/dgeni-meteoric')({
        src: paths.js,
        dest: './doc-build/client'
    })]);
    return new Promise(function(resolve) {
        dgeni.generate().then(function() { resolve(); });
    });
});

gulp.task('doc-styles', function() {
    return gulp.src('docs/styles/main.scss')
        .pipe(gulp.dest('doc-build/client/styles'));
});

gulp.task('doc-side-nav', function() {
    var docPath = './doc-build/client/partials/api';
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
            var segmented = m.split('.html')[0].split('/');
            m = {
                path: 'DocPage' + segmented[segmented.length - 1],
                segmented: segmented
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
            .pipe(gulp.dest('doc-build/client/templates'));
    });
});

gulp.task('create-meteor-doc-project', function(cb) {
    exec('meteor create meteoric-doc', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        console.log('Renaming meteoric-doc to doc-build ...');
        exec('rm -rf doc-build', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);

            exec('mv meteoric-doc doc-build', function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                console.log('done.');
                cb(err);
            });
        });
    });
});

gulp.task('setup-meteor-doc-project-packages', function() {
    gulp.src('docs/templates/packages.template')
        .pipe(rename('packages'))
        .pipe(gulp.dest('doc-build/.meteor'));
});

gulp.task('clean-up-meteor-doc-project', function(cb) {
    exec('rm -rf doc-build/server', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('create-router-meteor-doc-project', function(cb) {
    var docPath = './doc-build/client/partials/api';
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
            var segmented = m.split('.html')[0].split('/');
            return 'DocPage' + segmented[segmented.length - 1];
        });

        return gulp.src('docs/templates/router.template.js')
            .pipe(template({modules: modules}))
            .pipe(gulp.dest('doc-build/lib'));
    });
});

gulp.task('doc', function() {
    runSequence(
        'create-meteor-doc-project',
        'setup-meteor-doc-project-packages',
        'clean-up-meteor-doc-project',
        'dgeni',
        'create-router-meteor-doc-project',
        'doc-styles');
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['doc']);
    gulp.watch(paths.templates, ['doc']);
    gulp.watch(paths.docStyles, ['doc']);
});

gulp.task('default', ['watchers']);