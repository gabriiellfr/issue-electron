const gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    ngAnnotate = require('gulp-ng-annotate'),
    // winInstaller = require('electron-windows-installer'),
    gulpAsar = require('gulp-asar'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

    APP_PREFIX = 'app',
    SRC_CODE = ['./app/app-module.js', './app/**/*.js', './app/**/**/*.js', './app/shared/filters/*.js', './app/shared/components/*.js', './app/shared/factories/*.js', './app/app-config.js'],
    DIST_PATH = './dist/',
    FOLDERS_TO_CLEAN = ['dist', 'resources/app.asar'];

gulp.task('default', () => {
    runSequence(
        'clean:temporary',
        'build:bundle',
        'build:min',
        'build:asar'
    );
});

// Deleta config
gulp.task('clean:temporary', () => {
    return del(FOLDERS_TO_CLEAN);
});

// Unifica
gulp.task('build:bundle', () => {

    return gulp.src(SRC_CODE)
        .pipe(ngAnnotate())
        .pipe(concat(APP_PREFIX + '.js'))
        .pipe(gulp.dest(DIST_PATH));
});

// Minifica JS
gulp.task('build:min', () => {

    return gulp.src(SRC_CODE)
        .pipe(sourcemaps.init())
        .pipe(concat(APP_PREFIX + '.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ 'mangle': false }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH));
});

gulp.task('build:win-installer', function(done) {
  winInstaller({
    appDirectory: './',
    outputDirectory: './',
    arch: 'ia32'
  }).then(done).catch(done);
});
 
gulp.task('build:asar', function() {
  gulp.src('./dist/*.js')
  .pipe(gulpAsar('app.asar'))
  .pipe(gulp.dest('./resources'));
});