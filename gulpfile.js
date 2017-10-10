'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var jMerge = require('gulp-merge-json');
var inlineSource = require('gulp-inline-source');
var path = require('path');
var revAll = require('gulp-rev-all');

var params = require('./parameters.json');

gulp.task('env', function() {

  return gulp.src('env.js')
    .pipe(replace('{%env%}', JSON.stringify(params)))
    .pipe(gulp.dest('src/'));
});

gulp.task('parameters', function() {

    return gulp.src(['./parameters.dist.json', './parameters.json'])
        .pipe(jMerge({ fileName:'parameters.json'}))
        .pipe(gulp.dest('./'));
});

// gulp.task('inlinesource', function() {
//   var inlineBundle = gulp.src('/build/es5-bundled-server/index.html')
//     .pipe(inlineSource())
//     .pipe(gulp.dest('/build/es5-bundled-server/'));

//   return inlineBundle;
// });


// Invalidates cache on each deploy
// Rename hash files
var revisionConfig = {
  dontRenameFile: ['index.html', 'service-worker.js', 'robots.txt', 'favicon.ico', 'bower.json', /\/images\/.*/, /\/src\/_locales\/.*/],
  dontUpdateReference: ['index.html', 'service-worker.js', 'robots.txt', 'favicon.ico', 'bower.json', /\/images\/.*/, /\/src\/_locales\/.*/]
};

gulp.task('revision', function() {
  return gulp.src('build/es5-bundled-server' + '/**')
    .pipe(revAll.revision(revisionConfig))
    .pipe(gulp.dest('build/es5-bundled-server'))
    .pipe(gulp.dest('build/dist'));
});

gulp.task('default', ['env', 'parameters']);
