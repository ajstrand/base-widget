import gulp from "gulp"
//import rename from "gulp-rename"
import pkg from "gulp-uglify-es"
const uglify = pkg.default
//import babel from "gulp-babel"
function defaultTask(cb) {
  cb()
  // src('lib/**/*.js')
  // .pipe(init())
  //   .pipe(plugin1())
  //   .pipe(plugin2())
  // .pipe(write())
  // .pipe(dest('dist'));

  // gulp
  //   .src("example.js")
  //   // .pipe(babel({
  //   //     presets: ['@babel/env']
  //   // }))
  //   .pipe(uglify())
  //   //.pipe(rename('example.cjs'))

  //   .pipe(gulp.dest("dist"))

  gulp
    .src("index.js")
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    .pipe(uglify())
    .pipe(gulp.dest("dist"))

  gulp
    .src("lib/*.js")
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    //.pipe(uglify())
    .pipe(gulp.dest("dist/lib"))

  gulp
    .src("package.json")
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    .pipe(gulp.dest("dist/"))

  gulp
    .src("*.ini")
    // .pipe(babel({
    //     presets: ['@babel/env']
    // }))
    .pipe(gulp.dest("dist/"))
}

const _default = defaultTask
export { _default as default }
