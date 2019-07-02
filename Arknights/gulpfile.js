//只要是通果nps install 安装过得包都可以使用
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const uglify =require('gulp-uglify')
const cleanCss = require('gulp-clean-css')
const babel =require('gulp-babel')
const connect =require('gulp-connect')
const sass = require('gulp-sass')
//制定gulp任务
gulp.task('default',()=>{
    console.log('default')
})
//把src里面的html文件取出来，做一些压缩的任务
gulp.task('html',() =>{
    gulp.src('src/**/*.html')
    .pipe(htmlmin({
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS 
    }))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())
})

//js任务是把文件取出来通过babel把es6转换成es5语法再通过uglify压缩混淆
gulp.task('js',()=>{
    gulp.src('src/js/**/*.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload())
})

gulp.task('css',()=>{
    //先把scss文件转换成css文件 在压缩
    gulp.src('src/css/**/*.scss')
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload())
})
gulp.task('libs',()=>{
    gulp.src('src/libs/**/*')
     .pipe(gulp.dest('dist/libs'))
})
gulp.task('images',()=>{
    gulp.src('src/images/**/*')
     .pipe(gulp.dest('dist/images'))   
})
//开启一个服务器
//配置项：livereload支持热跟新，port端口号，root项目根目录
gulp.task('server',()=> {
    connect.server({
        livereload: true,
        port: 2333,
        root:'dist'
    });
});

gulp.task('watch',()=>{
    //监听文件修改执行对应任务
    //src下面任意html文件发生修改了就要重新执行一次html任务
    gulp.watch('src/**/*.html',['html'])
    gulp.watch('src/js/**/*.js',['js'])
    gulp.watch('src/css/**/*.scss',['css'])  
})

//直接运行gulp这时会漠然的找到default任务，后面数组里的任务都会一起执行
gulp.task('default',['html','css','images','libs','js','server','watch'])