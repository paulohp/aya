'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var pagespeed = require('psi');
var reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('public/scripts/**/*.js')
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.jshint.reporter('fail'))
  .pipe(reload({stream: true, once: true}));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('public/images/**/*')
  .pipe($.cache($.imagemin({
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'))
  .pipe(reload({stream: true, once: true}))
  .pipe($.size({title: 'images'}));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
  return gulp.src('public/styles/**/*.css')
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('public/styles'))
  .pipe(reload({stream: true}))
  .pipe($.size({title: 'styles:css'}));
});

// Compile Sass For Style Guide Components (app/styles/components)
gulp.task('styles:components', function () {
  return gulp.src('public/styles/components/components.scss')
  .pipe($.rubySass({
    style: 'expanded',
    precision: 10,
    loadPath: ['public/styles/components']
  }))
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('public/styles/components'))
  .pipe($.size({title: 'styles:components'}));
});

// Compile Any Other Sass Files You Added (app/styles)
gulp.task('styles:scss', function () {
  return gulp.src(['public/styles/**/*.scss', '!app/styles/components/components.scss'])
  .pipe($.rubySass({
    style: 'expanded',
    precision: 10,
    loadPath: ['public/styles']
  }))
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('.tmp/styles'))
  .pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('styles', ['styles:components', 'styles:scss', 'styles:css']);

// Clean Output Directory
gulp.task('clean', function (cb) {
  rimraf('dist', rimraf.bind({}, '.tmp', cb));
});

// Watch Files For Changes & Reload
gulp.task('serve', function () {
  nodemon({ script: 'app.js', ext: 'html js', ignore: [] })
  //.on('change', ['jshint'])
  .on('restart', function () {
    console.log('restarted!')
  })

  gulp.watch(['public/**/*.html'], reload);
  gulp.watch(['public/styles/**/*.{css,scss}'], ['styles']);
  gulp.watch(['.tmp/styles/**/*.css'], reload);
  gulp.watch(['public/scripts/**/*.js'], ['jshint']);
  gulp.watch(['public/images/**/*'], ['images']);
});

// Build Production Files
gulp.task('build', function (cb) {
  runSequence('styles', ['jshint', 'html', 'images'], cb);
});

// Default Task
gulp.task('default', ['clean'], function (cb) {
  gulp.start('build', cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
    // By default, we use the PageSpeed Insights
    // free (no API key) tier. You can use a Google
    // Developer API key if you have one. See
    // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
    url: 'https://example.com',
    strategy: 'mobile'
  }));
