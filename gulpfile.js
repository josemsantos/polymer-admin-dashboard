'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var jMerge = require('gulp-merge-json');
var inlineSource = require('gulp-inline-source');

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
// 
//   return inlineBundle;
// });

gulp.task('default', ['env', 'parameters']);
