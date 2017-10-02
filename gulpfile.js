'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var jMerge = require('gulp-merge-json');

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

gulp.task('default', ['env', 'parameters']);
