'use strict';

const path = require('path');
var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var replace = require('gulp-replace');
var jMerge = require('gulp-merge-json');
var inlineSource = require('gulp-inline-source');

var params = require('./parameters.json');
const precacheParams = require('./sw-precache-config.js');

// Keep the global.config above any of the gulp-tasks that depend on it
global.config = {
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    build: {
      rootDirectory: 'build',
      bundledDirectory: 'es5-bundled'
    },
    params: params,
    // Path to your service worker, relative to the build root directory
    serviceWorkerPath: 'service-worker.js',
    // Service Worker precache options based on
    // https://github.com/GoogleChrome/sw-precache#options-parameter
    swPrecacheConfig: precacheParams
  };
  
  // Build paths
  global.config.bundledPath = path.join(global.config.build.rootDirectory, global.config.build.bundledDirectory);

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

gulp.task('inlinesource', function() {
    return gulp.src(global.config.bundledPath + '/index.html')
                .pipe($.inlineSource())
                .pipe(gulp.dest(global.config.bundledPath));
});

gulp.task('default', ['parameters', 'env']);
