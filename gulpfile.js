const gulp = require('gulp');
const sass = require('gulp-sass');
const smaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const cssMin = require('gulp-minify-css');
const prefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const gIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const path = './src/';
let prod = false;

gulp.task('style', () => {
  gulp.src(`${path}/styles/main.{sass,scss}`)
  .pipe(plumber({
    errorHandler: notify.onError(err => {
      return {
        title: 'style error',
        message: err.message
      }
    })
  }))
  .pipe(gIf(!prod, smaps.init()))
  .pipe(sass())
  .pipe(prefixer({
    cascade: 'false',
    browsers: ['last 50 versions']
  }))
  .pipe(cssMin())
  .pipe(gIf(!prod, smaps.write('../maps')))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream({match: '**/*.css'}))

})
gulp.task('js', () => {
  gulp.src(`${path}js/main.js`)
  .pipe(plumber({
    errorHandler: notify.onError(err => {
      return {
        title: 'js',
        message: err.message
      }
    })
  }))
  .pipe(gIf(!prod, smaps.init()))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(gIf(!prod, smaps.write('../maps')))
  .pipe(gulp.dest('dist'))
})

gulp.task('serve', ()=> {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('src/**/*.{sass,scss}',['style']);
  gulp.watch('src/**/*.js',['js']);
  gulp.watch('dist/main.js').on('change',browserSync.reload);
  gulp.watch('*.html').on('change',browserSync.reload);

})
gulp.task('setDev', () => {
  return prod = false;
})
gulp.task('setProd', () => {
  return prod = true;
})
gulp.task('build', ['setProd', 'style', 'js'])
gulp.task('default', ['setDev', 'serve'])
