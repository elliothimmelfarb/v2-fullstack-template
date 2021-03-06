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
    input: 'client/css/**/*.scss',
    output: 'public/css'
  },
  favicon: {
    input: './client/favicon.ico',
    output: './public'
  }
}

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['html', 'css', 'js']);

gulp.task('favicon', function() {
  return gulp.src(paths.favicon.input)
    .pipe(gup.dest(paths.favicon.output));
})

// nodemon
gulp.task('serve', function() {
  nodemon({
      script: 'app.js',
      ext: 'html js',
      ignore: ['./client', './public']
    })
    .on('restart', function() {
      console.log('restarted!');
    })
});

gulp.task('js', ['clean:js'], function() {
  gulp.src(paths.js.input)
  .pipe(plumber())
  .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
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


gulp.task('css', ['clean:css'], function() {
  return gulp.src(paths.css.input)
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
