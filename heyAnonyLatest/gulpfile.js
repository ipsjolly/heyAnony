var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


var templateCache = require('gulp-angular-templatecache');
gulp.task('template', function(done){
    gulp.src('./www/templates/**/*.html')
    .pipe(templateCache({
        standalone:true,
        root: 'templates'}))
    .pipe(gulp.dest('./www/dist'))
    .on('end', done);
<<<<<<< HEAD
=======
});


var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require("gulp-uglify");
gulp.task('html', function (done) {
  return gulp.src('./www/*.html')
        .pipe(useref())
        .pipe(gulp.dest('./www/dist'));
});

gulp.task('uglify', function() {
  gulp.src('./www/js/*.js')
    .pipe(uglify('ugly.js', {
      outSourceMap: true
    }))
    .pipe(gulp.dest('./www/dist'))
>>>>>>> origin/master
});