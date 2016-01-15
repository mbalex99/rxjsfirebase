var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('clean', function(){
    return del('js');
});

gulp.task('default', ['clean'], function(){
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = gulp.src('ts/**/*.ts')
        .pipe(ts(tsProject))
        
        
    return tsResult.js.pipe(concat('index.js')).pipe(gulp.dest('js'));
});