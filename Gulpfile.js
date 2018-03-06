/**
 * Gulpfile
 * @author Alexandre Simonin
 * @created 24/01/2018
 */

'use strict';

var
  // For gulp utilisation
  gulp = require('gulp'),

  // Concat sources file and rename
  concat = require('gulp-concat'),

  // Minify Js
  uglify = require('gulp-uglify'),

  // CSS plugins
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer');

var DIR = {
    'src': './www',
    'dest': './www/dist'
};

/**
 * @task styles
 * Compile sass/scss to unique css file
 */
gulp.task('styles', function () {
    gulp.src(DIR.src + '/scss/**/*.+(scss|sass)')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIR.dest + '/css/'));
});

/**
 * @task styles-prod
 * Compile sass/scss to unique css file
 */
gulp.task('styles-prod', function () {
    gulp.src(DIR.src + '/scss/**/*.+(scss|sass)')
    .pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }))
    .pipe(gulp.dest(DIR.dest + '/css/'));
});

/**
 * @task scripts
 * Compile js scripts to unique js file
 */
gulp.task('scripts', function () {
    gulp.src([
        DIR.src + '/js/externals/**/*.js',
        DIR.src + '/js/**/*.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIR.dest + '/js/'));
});

/**
 * @task scripts-prod
 * Compile js scripts to unique js file
 */
gulp.task('scripts-prod', function () {
    gulp.src([
        DIR.src + '/js/externals/**/*.js',
        DIR.src + '/js/**/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(DIR.dest + '/js/'));
});

/**
 * @task watch
 * Compile/watch app OTF (dev)
 */
gulp.task('watch', function () {
    gulp.watch(DIR.src + '/scss/**/*.+(scss|sass)', ['styles']);
    gulp.watch(DIR.src + '/js/**/*.js', ['scripts']);
});

/**
 * @task dist-dev
 * Compile styles and scripts
 */
gulp.task('dist-dev', ['styles', 'scripts'], function () {
    return true;
});

/**
 * @task dist-dev
 * Compile styles and scripts
 */
gulp.task('dist-prod', ['styles-prod', 'scripts-prod'], function () {
    return true;
});

/**
 * @task default
 * Compile/watch app OTF (dev)
 */
gulp.task('default', ['dist-dev'], function () {
    return true;
});
