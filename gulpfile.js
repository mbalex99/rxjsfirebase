var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');

gulp.task('clean', function(){
    return del('js');
});

gulp.task('default', ['clean'], function(){
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src('ts/**/*.ts')
        .pipe(ts(tsProject));
    
    var concatRegular = tsResult.js.pipe(concat('index.js'));
    var concatMinify = tsResult.js.pipe(concat('index.min.js'));
    var index = concatRegular.pipe(gulp.dest('js'));
    var indexMin = concatMinify.pipe(uglify()).pipe(gulp.dest('js'));
    
    return [index, indexMin];
});