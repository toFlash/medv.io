var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var shell = require('gulp-shell');
var path = require('path');

var BUILD = path.join(__dirname, 'build');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('css', function () {
  return gulp.src(['app/css/main.scss'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(cssnano())
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('js', ['webpack'], function () {
  return gulp.src(['build/app.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('watch', function () {
  gulp.watch(['app/css/*.scss'], ['css']);
  return gulp.src('', {read: false})
    .pipe(shell('webpack -w'));
});

gulp.task('webpack', shell.task('webpack'));

gulp.task('html', shell.task('jekyll build'));

gulp.task('serve', shell.task('jekyll serve -b -I'));

gulp.task('build', ['css', 'js', 'html']);

gulp.task('default', ['css', 'serve', 'watch']);
