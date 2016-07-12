'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const annotate = require('gulp-ng-annotate');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

// gulp.task()  --> define tasks
// gulp.src()   --> 'source'  -- input files
// gulp.dest()  --> 'destination' -- output/write files
// .pipe()      --> used to chain commands together
// gulp.watch() --> watch files for changes, to trigger behavior

let paths = {
  js: {
    input: 'client/js/**/*.js',
    output: 'public/js'
  },
  html: {
    input: 'client/html/**/*.html',
    output: 'public/html'
  },
  css: {
    input: 'client/css/**/*.css',
    output: 'public/css'
  },
  sass: {
    input: 'client/sass/**/*.scss'
  }
}

gulp.task('default', ['develop', 'angular-parts', 'sass', 'html', 'watch']);

// nodemon
gulp.task('develop', function() {
  nodemon({
      script: 'app.js',
      ext: 'html js',
    })
    .on('restart', function() {
      console.log('restarted!');
    })
});

gulp.task('angular-parts', ['clean:js'], function() {
  gulp.src(paths.js.input)
  .pipe(plumber())
  .pipe(sourcemaps.init())
    .pipe(concat('angular-parts.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(annotate())
    .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.js.output))
});
gulp.task('clean:js', function() {
  return del([paths.js.output]);
});

gulp.task('html', ['clean:html'], function() {
  return gulp.src(paths.html.input)
    .pipe(gulp.dest(paths.html.output))
});
gulp.task('clean:html', function() {
  return del([paths.html.output]);
});


gulp.task('sass', ['clean:css'], function() {
  return gulp.src(paths.sass.input)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css.output));
});
gulp.task('clean:css', function() {
  return del([paths.css.output]);
});

gulp.task('watch', function() {
  gulp.watch('client/html/**/*.html', ['html']);
  gulp.watch('client/js/**/*.js', ['angular-parts']);
  gulp.watch('client/sass/**/*.scss', ['sass']);
});
