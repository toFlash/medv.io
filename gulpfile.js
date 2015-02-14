var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var path = require('path');

gulp.task('default', function () {
    //gulp.src('src/less/*.less')
    //    .pipe(sourcemaps.init())
    //    .pipe(less({
    //        paths: [path.join(__dirname, 'less', 'includes')]
    //    }))
    //    .pipe(sourcemaps.write('.'))
    //    .pipe(gulp.dest('css'));

    gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css'])
        .pipe(gulp.dest('css'));
    
    gulp.src(['src/css/*.css', 'vendor/highlight/style.css', '!src/css/print.css'])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.init())
        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'));

    gulp.src(['src/css/print.css'])
        .pipe(gulp.dest('css'));

    gulp.src(['bower_components/jquery/dist/jquery.js', 'src/js/*.js', 'vendor/highlight/highlight.js'])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('js'));

});
