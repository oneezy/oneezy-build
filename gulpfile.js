var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var sequence = require('run-sequence');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var browsersync = require('browser-sync');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var sourcemaps = require('gulp-sourcemaps');

var config = {
  build: 'build/',
  src: 'src/',

  cssin: 'src/css/*.css',
  jsin: 'src/js/*.js',
  imgin: 'src/images/**/*.{jpg,jpeg,png,gif}',
  htmlin: 'src/**/*.html',
  otherin: 'src/**/*.{json,xml,svg,txt,ico}',

  cssout: 'build/css/',
  jsout: 'build/js/',
  imgout: 'build/images/',
  htmlout: 'build/'
};

/* BROWSER SYNC (dev)
************************************/
gulp.task('reload', function() {
  browsersync.reload();
});


/* HTML
************************************/
gulp.task('html', function() {
  return gulp.src(config.htmlin)
    .pipe(useref())
    .pipe(gulpif( '*.css', autoprefixer({ browsers: ['last 4 versions'], grid: true }) ))
    .pipe(gulpif( '*.css', cleancss() ))
    .pipe(gulpif( '*.js', uglify() ))
    .pipe(htmlmin({
      sortAttributes: true,
      sortClassName: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(config.build));
});

/* CSS
************************************/
gulp.task('css', function() {
  return gulp.src(config.cssin)
    // .pipe(sourcemaps.init())
    // .pipe(autoprefixer({ browsers: ['last 4 versions'], grid: true }))
    // .pipe(concat(config.cssoutname))
    // .pipe(cleancss())
    // .pipe(sourcemaps.write())
    // .pipe(gulp.dest(config.cssout))
    .pipe(browsersync.stream());
});

/* JS
************************************/
gulp.task('js', function() {
  return gulp.src(config.jsin)
    // .pipe(sourcemaps.init())
    // .pipe(concat(config.jsoutname))
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
    // .pipe(gulp.dest(config.jsout));
});

/* IMAGES
************************************/
gulp.task('img', function() {
  return gulp.src(config.imgin)
    .pipe(changed(config.imgout))
    .pipe(imagemin())
    .pipe(gulp.dest(config.imgout));
});

/* Other
************************************/
gulp.task('other', function() {
  return gulp.src(config.otherin)
    .pipe(gulp.dest(config.build));
});




/* PRODUCTION ENVIRONMENT
************************************/
// Clean
gulp.task('clean', function() {
  return del([config.build]);
});

// Start Server
gulp.task('build', function() {
  sequence('clean', ['js', 'css', 'img', 'html', 'other']);

  browsersync({
    server: config.build
  });
});


/* DEVELOPMENT ENVIRONMENT
************************************/
gulp.task('serve', function() {
  browsersync({
    server: config.src
  });

  gulp.watch([config.htmlin, config.jsin, config.otherin], ['reload']);
  gulp.watch(config.cssin, ['css']);
});

// Start Server
gulp.task('default', ['serve']);