var gulp = require('gulp');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');

var errorHandler = function (err) {
  notify.onError("Error: <%= error.message %>")(err);
  this.emit('end');
}

gulp.task('scripts', ['templates'], function () {

  var uglify = require('gulp-uglify');
  var wrapper = require('gulp-wrapper');
  var concat = require('gulp-concat');
  var pkg = require('./bower.json');
  var ng = require('gulp-ng-annotate');
  var jshint = require('gulp-jshint');

  var license =
    '/**\n' +
    ' * @license ' + pkg.name + ' v' + pkg.version + '\n' +
    ' * (c) 2015 Null McNull. https://github.com/McNull\n' +
    ' * License: MIT\n' +
    ' */\n';

  var header = '(function(angular, undefined) {\'use strict\';\n';
  var footer = '})(angular);';

  return gulp.src(['src/angular-dirty-form.js', 'src/**/*.js', 'tmp/**/*.js', '!**/*.test.js'])
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(concat('angular-dirty-form.min.js'))
    .pipe(ng())
    .pipe(wrapper({
      header: header,
      footer: footer
    }))
    .pipe(uglify())
    .pipe(wrapper({
      header: license
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({
      message: 'Generated \"<%= file.relative %>\"'
    }));

});

gulp.task('test', ['scripts'], function (done) {

  var karma = require('gulp-karma');
  var mbf = require('main-bower-files');

  var files = mbf({
    filter: ['**/*.js', '!**/bootstrap*'],
    includeDev: true
  }).concat(['src/angular-dirty-form.js', 'src/**/*.js', 'tmp/**/*.js']);

  return gulp.src(files, {
      read: false
    })
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', errorHandler);
  
});

gulp.task('templates', function () {

  var tc = require('gulp-angular-templatecache');
  var minHtml = require('gulp-minify-html');

  var TEMPLATE_HEADER = 'dlg.run(["$templateCache", function($templateCache) {';
  var TEMPLATE_FOOTER = '}]);';

  return gulp.src('src/**/*.ng.html')
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(minHtml({
      quotes: true
    }))
    .pipe(tc({
      filename: 'angular-dirty-form-templates.js',
      root: '/angular-dirty-form/',
      templateHeader: TEMPLATE_HEADER,
      templateFooter: TEMPLATE_FOOTER
    }))
    .pipe(gulp.dest('tmp/'))
    .pipe(notify({
      message: 'Generated \"<%= file.relative %>\"'
    }));

});

gulp.task('watch', ['build'], function (cb) {
  gulp.watch(['src/**/*.js', 'tmp/**/*.js', 'src/**/*.ng.html'], ['test'])
    .on('change', function (e) {
      console.log('File ' + e.path + ' was ' + e.type + ', running tasks...');
    });
  cb();
});

gulp.task('build', ['scripts']);

gulp.task('default', ['watch']);