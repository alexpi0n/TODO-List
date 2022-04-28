const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify')
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');

function sync(done) {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
    done() ;
}

function syncReload(done) {
    browserSync.reload()
    done();
}

function css() {
    return gulp
        .src('app/scss/style.scss')
        .pipe(plumber({
            errorHandler: notify.onError((err) => {
                return {
                    title: "Styles",
                    message: err.message
                }
            })
        }))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('app/css/'))
        .pipe(browserSync.stream());
}

function watchFiles() {
    gulp.watch('app/scss/**/*.scss', gulp.series(css, syncReload));
    gulp.watch('app/index.html', syncReload);
    gulp.watch('app/**/*.js', syncReload);
}

exports.css = css;
exports.default = gulp.series(css, sync, watchFiles);
