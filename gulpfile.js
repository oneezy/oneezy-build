var gulp = require('gulp');
var browsersync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var rename = require("gulp-rename");
var sequence = require('run-sequence');
var htmlreplace = require('gulp-html-replace');

var config = {
  dist: 'dist/',
  src: 'app/',

  cssin: 'app/css/**/*.css',
  jsin: 'app/js/**/*.js',
  imgin: 'app/images/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'app/**/*.html',

  cssout: 'dist/css/',
  jsout: 'dist/js/',
  imgout: 'dist/images/',
  htmlout: 'dist/**/*.html',

  cssoutname: 'styles.min.css',
  jsoutname: 'scripts.min.js',

  cssreplaceout: 'css/style.css',
  jsreplaceout: 'js/script.js'
};

/* BROWSER SYNC (dev)
************************************/
gulp.task('reload', function() {
  browsersync.reload();
});

gulp.task('serve', function() {
  browsersync({
    server: config.src
  });

  gulp.watch([config.htmlin, config.jsin], ['reload']);
  gulp.watch(config.cssin, ['css']);
});


/* CSS
************************************/
gulp.task('css', function() {
  return gulp.src(config.cssin)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({ browsers: ['last 4 versions'], grid: true }))
    .pipe(concat(config.cssoutname))
    .pipe(cleancss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssout))
    .pipe(browsersync.stream());
});

/* JS
************************************/
gulp.task('js', function() {
  return gulp.src(config.jsin)
    .pipe(sourcemaps.init())
    .pipe(concat(config.jsoutname))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.jsout));
});

/* IMAGES
************************************/
gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

/* HTML
************************************/
gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(htmlreplace({
      'css': 'css/styles.min.css',
      'js': 'js/scripts.min.js'
    }))
    .pipe(htmlmin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.dist))
});

/* BUILD ENVIRONMENT
************************************/
// Clean
gulp.task('clean', function() {
  return del([config.dist]);
});

// Build
gulp.task('build', function() {
  sequence('clean', ['html', 'js', 'css', 'img']);

  browsersync({
    server: config.dist
  });

  gulp.watch([config.htmlin, config.jsin], ['reload']);
  gulp.watch(config.cssin, ['css']);
});

/* DEV ENVIRONMENT
************************************/
gulp.task('default', ['serve']);