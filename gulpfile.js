const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
const autoprefixer = require('autoprefixer');
const cssnext = require('cssnext');
const browserSync = require('browser-sync');

gulp.task('browser-sync', () => {
  browserSync({
    proxy: '127.0.0.1:8080',
    online: false
  });
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('images', () => {
	return gulp.src('public/images/**/*')
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images/'));
});

gulp.task('styles', () => {
  const postcssPlugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
    cssnext
  ];

  return gulp.src(['styles/main.scss'])
    .pipe(plugins.plumber({
      errorHandler(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(plugins.sass())
    .pipe(plugins.postcss(postcssPlugins))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.reload({ stream: true }));
});

const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('gulplog');
const assign = require('lodash.assign');


const opts = assign({}, watchify.args, {
	entries: ['./scripts/main.js'],
	debug: true
});
const b = watchify(browserify(opts));

gulp.task('scripts', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', log.info); // output build logs to terminal

function bundle() {
	return b.bundle()
		.on('error', log.error.bind(log, 'Browserify Error'))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/js/'))
		.pipe(browserSync.reload({ stream: true }));
}

gulp.task('watch', () => {
	gulp.watch('scripts/**/*.js', gulp.series('scripts'));
	gulp.watch('styles/**/*.scss', gulp.series('styles'));
	gulp.watch('views/**/*.pug', gulp.series('reload'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));
