var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var shell = require('gulp-shell');
var path = require('path');

var css = [
    'src/css/*.less',
    'src/css/*.css',
    'vendor/highlight/style.css',
    '!src/css/print.css'
];

var js = [
    'bower_components/jquery/dist/jquery.js',
    'src/js/*.js',
    'vendor/highlight/highlight.js'
];

var html = [
    './*.html',
    'index.json',
    '_posts/*',
    '_layouts/*',
    '_includes/*'
];

gulp.task('css', function () {
    gulp.src(css)
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(connect.reload())
        .pipe(gulp.dest('css'))
        .pipe(gulp.dest('_site/css'));

    gulp.src(['src/css/print.css'])
        .pipe(gulp.dest('css'));
});

gulp.task('js', function () {
    gulp.src(js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(connect.reload())
        .pipe(gulp.dest('js'))
        .pipe(gulp.dest('_site/js'));
});

gulp.task('html', shell.task('jekyll build'));

gulp.task('watch', function () {
    gulp.watch(css, ['css']);
    gulp.watch(js, ['js']);
    gulp.watch(html, ['html'])
});

gulp.task('connect', function () {
    connect.server({
        root: ['_site'],
        port: 4000,
        livereload: true
    });
});

gulp.task('default', ['css', 'js', 'html', 'connect', 'watch']);
