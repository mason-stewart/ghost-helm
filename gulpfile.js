var gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha');

gulp.task('default', function () {
  gulp.watch(['index.js', 'gulpfile.js', 'test/main.js']).on('change', function(){
    return gulp.src('test/main.js', {read: false})
      .pipe(mocha({reporter: 'nyan'}))
      .on('error',function(e){
        gutil.log(e);
      });
  });
});