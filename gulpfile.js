var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');
var merge = require('merge2');

gulp.task('clean', function(){
    return del('js');
});

gulp.task('default', ['clean'], function(){
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src('ts/**/*.ts')
        .pipe(ts(tsProject));
        
        
        
    return merge([
        tsResult.dts.pipe(gulp.dest('js')),
        tsResult.js.pipe(gulp.dest('js'))
    ]);
});