'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var replace = require('gulp-replace');
var jMerge = require('gulp-merge-json');
//var inlineSource = require('gulp-inline-source');
var revAll = require('gulp-rev-all');

var params = require('./parameters.json');
//const precacheParams = require('./sw-precache-config.js');
const git = require("gulp-git");

// Keep the global.config above any of the gulp-tasks that depend on it
global.config = {
    polymerJsonPath: path.join(process.cwd(), 'polymer.json'),
    build: {
      rootDirectory: 'build',
      bundledDirectory: 'bundled',
      bundledDirectoryName: 'es5-bundled-server',
      dist: 'dist'
    },
    params: params,
    // Path to your service worker, relative to the build root directory
    //serviceWorkerPath: 'service-worker.js',
    // Service Worker precache options based on
    // https://github.com/GoogleChrome/sw-precache#options-parameter
    //swPrecacheConfig: precacheParams
};
  
// Build paths
global.config.bundledPath = path.join(global.config.build.rootDirectory, global.config.build.bundledDirectory);
global.config.releasePath = path.join(global.config.build.rootDirectory, global.config.build.bundledDirectoryName);

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


// Invalidates cache on each deploy
// Rename hash files
var revisionConfig = {
  dontRenameFile: ['index.html', 'service-worker.js', 'robots.txt', 'favicon.ico', 'bower.json', /\/images\/.*/, /\/src\/_locales\/.*/],
  dontUpdateReference: ['index.html', 'service-worker.js', 'robots.txt', 'favicon.ico', 'bower.json', /\/images\/.*/, /\/src\/_locales\/.*/]
};

var bundledDirectoryServer = global.config.build.rootDirectory + '/' + global.config.build.bundledDirectoryName,
    bundledDistDirectory = global.config.build.rootDirectory + '/' + global.config.build.dist;

gulp.task('revision', function() {
  return gulp.src(bundledDirectoryServer + '/**')
    .pipe(revAll.revision(revisionConfig))
    .pipe(gulp.dest(bundledDirectoryServer))
    .pipe(gulp.dest(bundledDistDirectory));
});

gulp.task('update-cache-version', function() {
  git.exec({args : 'rev-parse --short --verify HEAD', quiet: true}, function (err, stdout) {
      if (err) throw err;
      gulp.src(global.config.bundledPath + '/service-worker.js')
      .pipe($.replace('%precache_version%', stdout.replace(/(\r\n|\n|\r)/gm,"")))
      .pipe(gulp.dest(global.config.bundledPath, {overwrite: true}));

      gulp.src(global.config.releasePath + '/service-worker.js')
      .pipe($.replace('%precache_version%', stdout.replace(/(\r\n|\n|\r)/gm,"")))
      .pipe(gulp.dest(global.config.releasePath, {overwrite: true}));

      return;
  });    

  return ;
});

gulp.task('default', ['parameters', 'env']);
