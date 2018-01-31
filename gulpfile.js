"use strict";

const gulp = require('gulp');
const pump = require('pump');
const runSequence = require('run-sequence');
const del = require('del');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const webpack = require('webpack-stream');

const lr = require('tiny-lr');

const devServer = lr();
const assetsBase = "assets";

gulp.task('default', () => {
  // gulp entry
  runSequence(
    'clean',
    'compile:css',
    'compile:ts'
  );
});

gulp.task('serve', () => {
  // gulp entry
  runSequence(
    'clean',
    'compile:css',
    'compile:ts',
    'watch'
  );
});

gulp.task('clean', (cb) => {
  return del([
    `${assetsBase}/css/dist/**`,
    `${assetsBase}/js/dist/**`
  ], cb);
});

gulp.task('compile:css', () => {

  let postCSSPlugins = [
    autoprefixer({browsers: ['last 3 version']}),
    cssnano()
  ];

  pump(
    [
      gulp.src(`${assetsBase}/css/src/**/*.scss`),
      sourcemaps.init(),
      sass().on('error', sass.logError),
      postcss(postCSSPlugins),
      sourcemaps.write(`.`),
      gulp.dest(`${assetsBase}/css/dist/`)
    ]
  );

});

gulp.task('compile:ts', () => {

  pump(
    [
      // no gulp.src here. It's been specified in webpack script config file.
      webpack(require('./webpack/w.c.script')),
      gulp.dest(`${assetsBase}/js/dist/`)
    ]
  );

});

gulp.task('watch', () => {

  devServer.listen(51905, (err) => {
    if (err) {
      return console.error(err);
    };

    // Watch .scss files
    gulp.watch('assets/css/src/**/*.scss', ['compile:css']);

    // Watch .js files
    gulp.watch(['assets/js/src/**/*.ts', '!assets/js/src/**/*.d.ts'], ['compile:ts']);

  });

});