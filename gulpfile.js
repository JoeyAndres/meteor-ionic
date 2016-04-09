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
    templates: [
        './src/components/**/*.html',
        './docs/**/*'
    ],
    docStyles: ['./docs/styles/**/*.scss']
};

gulp.task('dgeni-clean', function(cb) {
    exec('rm -rf doc-build/client/partials', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('dgeni', ['dgeni-clean'], function(done) {
    var dgeni = new Dgeni([require('./docs/dgeni-meteoric')({
        src: paths.js,
        dest: './doc-build/client'
    })]);

    dgeni.generate().then(function() { done(); });
});

gulp.task('doc-styles', function() {
    return gulp.src('docs/templates/meteor/styles/main.scss')
        .pipe(gulp.dest('doc-build/client/styles'));
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
    gulp.src('docs/templates/meteor/packages.template')
        .pipe(rename('packages'))
        .pipe(gulp.dest('doc-build/.meteor'));
});

gulp.task('_doc-side-nav', function() {
    var docPath = 'doc-build/client/partials/api';
    var modules = [];

    return new Promise(function(resolve) {
        gulp.src([
            docPath + '/meteoric/{directive,object,service}/**/*.{md,html,markdown}'
        ]).pipe(es.map(function (file, callback) {
            // Grab relative path from ionic-site root
            var relpath = file.path.replace(RegExp('^.*?' + docPath + '/'), '');
            modules.push(relpath);

            callback();
        })).on('end', function () {
            modules = modules.map(function (m) {
                // get rid of .html,
                var segmented = m.split('.html')[0].split('/');
                m = {
                    path: 'DocPage' + segmented[segmented.length - 1],
                    segmented: segmented
                };
                return m;
            });

            var main_modules = _.union(modules.map(function (m) {
                return m.segmented[1];
            })).map(function (m) {
                var childModules = modules.filter(function (m2) {
                    return m2.segmented[1] == m;
                });
                var new_m = {
                    name: m,
                    path: childModules[0].path,
                    childModules: childModules
                };
                return new_m;
            });

            gulp.src('docs/templates/meteor/client/templates/sidenav.template.html')
                .pipe(template({main_modules: main_modules}))
                .pipe(rename('doc-side-nav.html'))
                .pipe(gulp.dest('doc-build/client/templates'))
                .on('end', function() { resolve(); });
        });
    });
});

gulp.task('_setup-meteor-doc-project-templates', function() {
    return gulp.src([
        'docs/templates/meteor/client/**/*',
        '!./docs/templates/meteor/client/**/*.template.*'
    ]).pipe(gulp.dest('doc-build/client'));
});

gulp.task('setup-meteor-doc-project-templates', function(cb) {
    return runSequence('_setup-meteor-doc-project-templates', 'dgeni', '_doc-side-nav', cb);
});

gulp.task('clean-up-meteor-doc-project', function(cb) {
    exec('rm -rf doc-build/server doc-build/client doc-build/lib doc-build/.meteor/packages doc-build/public', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});


gulp.task('create-router-meteor-doc-project', function() {
    var docPath = 'doc-build/client/partials/api';
    var modules = [];

    return new Promise(function(resolve) {
        gulp.src([
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

            gulp.src('docs/templates/meteor/router.template.js')
                .pipe(template({modules: modules}))
                .pipe(rename('router.js'))
                .pipe(gulp.dest('doc-build/lib'))
                .on('end', function() { resolve(); });
        });
    });
});

gulp.task('copy-meteor-doc-public-files', function() {
    return gulp.src('docs/templates/meteor/public/**/*.*', { base: './' })
        .pipe(rename({
            dirname: ""
        }))
        .pipe(gulp.dest('doc-build/public'));
});

gulp.task('setup-meteor-doc-project', function(cb) {
    runSequence(
        'clean-up-meteor-doc-project',
        'copy-meteor-doc-public-files',
        'setup-meteor-doc-project-templates',
        'setup-meteor-doc-project-packages',
        'create-router-meteor-doc-project',
        'doc-styles', cb);
});

gulp.task('doc', function(cb) {
    runSequence('create-meteor-doc-project', 'setup-meteor-doc-project', cb);
});

// Watcher section.
gulp.task('watchers', function () {
    gulp.watch(paths.js, ['setup-meteor-doc-project']);
    gulp.watch(paths.templates, ['setup-meteor-doc-project']);
    gulp.watch(paths.docStyles, ['setup-meteor-doc-project']);
});

gulp.task('default', ['setup-meteor-doc-project', 'watchers']);