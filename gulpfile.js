const gulp = require('gulp'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    exec = require('gulp-exec'),
    babel = require('gulp-babel');

    APP_PREFIX = 'app',
    SRC_CODE = ['./app/**/*.js', './app/**/**/*.js', './app/shared/factories/*.js', './app/shared/directives/**/*.js', './app/shared/sevices/*.js', './app/shared/**/*.js'],
    DIST_PATH = './dist/',
    FOLDERS_TO_CLEAN = ['dist', 'resources/app.asar'],
    WATCH_RELOAD_TEMPLATE = ['index.html', './app/pages/**/*.html', './app/shared/directives/**/*.html'],
    WATCH_RELOAD = ['./app/**/*.*', '.app/shared/**/*.*'];

gulp.task('default', ['execute', 'watch']);

// Deleta config
gulp.task('clean:temporary', () => {
    clean('dist');
});

// Unifica
gulp.task('build:bundle', ['clean:temporary'], () => {

    gulp.src(SRC_CODE)
        .pipe(ngAnnotate())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat(APP_PREFIX + '.js'))
        .pipe(gulp.dest(DIST_PATH));
});

// Minifica JS
gulp.task('build:min', ['build:bundle'], () => {

    gulp.src(SRC_CODE)
        // .pipe(sourcemaps.init())
        .pipe(concat(APP_PREFIX + '.min.js'))
        .pipe(ngAnnotate())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify({ 'mangle': false }))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH));
});

gulp.task('build:win-installer', function(done) {
  winInstaller({
    appDirectory: './',
    outputDirectory: './',
    arch: 'ia32'
  }).then(done).catch(done);
});

gulp.task('execute', ['build:min'], () => {
    gulp.src('./')
        .pipe(exec('npm start'));
});
 
gulp.task('build:asar', function() {
  gulp.src(DIST_PATH + '*.js')
  .pipe(gulpAsar('app.asar'))
  .pipe(gulp.dest('./resources'));
});

gulp.task('watch', () => {

    gulp.watch(WATCH_RELOAD_TEMPLATE, ['build:min']);
    gulp.watch(WATCH_RELOAD, ['build:min']);
});