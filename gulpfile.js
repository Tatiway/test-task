'use strict';

var gulp = require('gulp'),
    //sass
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    //optimise css
    cssmin = require('gulp-cssmin'),
    rename = require("gulp-rename"),
    //reload, local server
    browserSync = require('browser-sync').create(),
    nodemon = require('gulp-nodemon');



    gulp.task('sass', function(){
      return gulp.src('app/assets/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'ie 7', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12'
          ],
          cascade: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/dist/css/'))
        .pipe(browserSync.reload({
          stream: true
        }))
    });

    gulp.task('cssmin', function() {
      return gulp.src('app/dist/css/main.css')
        .pipe(cssmin())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest('app/dist/css/'))
        .pipe(browserSync.reload({
          stream: true
        }))
    });

    gulp.task('images', function(){
      return gulp.src('app/assets/images/*.+(png|jpg|gif|svg)')
      .pipe(imagemin())
      .pipe(gulp.dist('app/dist/images'))
    });



    gulp.task('browserSync', ['nodemon'], function() {
    	browserSync.init(null, {
    		proxy: "http://localhost:5000",
            files: ["app/**/*.*"],
            browser: "google chrome",
            port: 7000,
    	});
    });

    gulp.task('nodemon', function (cb) {

    	var started = false;

    	return nodemon({
    		script: 'server.js'
    	}).on('start', function () {
    		if (!started) {
    			cb();
    			started = true;
    		}
    	});
    });


    gulp.task('watch',['browserSync', 'sass','cssmin' ], function(){
      gulp.watch('app/assets/sass/*.scss', ['sass']);
      gulp.watch('app/dist/css/main.css', ['cssmin']);
      gulp.watch('app/*.html', browserSync.reload);
    });
