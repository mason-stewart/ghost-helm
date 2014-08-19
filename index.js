/*
 * ghost-helm
 * https://github.com/masondesu/ghost-helm
 *
 * Copyright (c) 2014 Mason Stewart
 * Licensed under the MIT license.
 */

'use strict';

// Hey!

//                           _               
//    ________  ____ ___  __(_)_______  _____
//   / ___/ _ \/ __ `/ / / / / ___/ _ \/ ___/
//  / /  /  __/ /_/ / /_/ / / /  /  __(__  ) 
// /_/   \___/\__, /\__,_/_/_/   \___/____/  
//              /_/                          

var packageJSON = require(process.cwd() + '/package.json'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    exec = require('child_process').exec,
    assign  = require("lodash.assign"),
    Q = require('q'),
    autoprefixer = require("gulp-autoprefixer"),
    cache = require("gulp-cache"),
    csso = require("gulp-csso"),
    directoryMap = require('gulp-directory-map'),
    filter = require("gulp-filter"),
    flatten = require("gulp-flatten"),
    gulpIf = require("gulp-if"),
    imagemin = require("gulp-imagemin"),
    inject = require("gulp-inject"),
    jadeEngine = require("jade"),
    jade = require("gulp-jade"),
    jshint = require("gulp-jshint"),
    jshintStylish = require("jshint-stylish"),
    livereload = require("gulp-livereload"),
    markdown = require("gulp-markdown"),
    mocha = require("gulp-mocha"),
    plumber = require("gulp-plumber"),
    prefix = require('gulp-prefix'),
    print = require("gulp-print"),
    rimraf = require("gulp-rimraf"),
    sass = require("gulp-sass"),
    sitemap = require("gulp-sitemap"),
    size = require("gulp-size"),
    uglify = require("gulp-uglify"),
    useref = require("gulp-useref"),
    util = require("gulp-util"),
    fs = require('fs'),
    es = require('event-stream'),
    path = require('path'),
    // the defaults
    defaults = {
      distDir: 'dist',

      templatesDir: 'app/templates/pages',
      templatesBaseDir: 'app/templates',
      templatesDistDir: '.tmp',

      stylesDir: 'app/styles/main.scss',
      stylesDistDir: '.tmp/styles',

      jsDir: 'app/scripts/**/*.js',

      assetBuildDir: '.tmp/**/*.html',
      userefSearchPath: ['app','.tmp'],

      imagesDir: ['app/images/**/*', 'app/bower_components/ghost-shield/dist/images/**/*'],
      imagesDistDir: 'dist/images',

      fontDir: ['app/bower_components/ghost-shield/dist/webfonts/*'],

      cname: 'CNAME',

      sitemapDir: 'dist/**/*.html',
      siteUrl: 'http://theironyard.com',

      cleanDir: ['.tmp', 'dist'],

      // deployCommand: 'sh deploy.sh',
      deployCommand: 'ls',

      urlsPath: 'urls.json',
      sidebar: '.tmp/sidebar.html',
      sidebarTemplate: 'app/templates/includes/sidebar.jade',

      markdownLayout: 'app/templates/layouts/markdown-layout.jade'
    };

module.exports.setup = function(config, outerGulp){
  // Overrite defaults with user config properties
  config = config || {};
  config = assign(defaults, config);


  //          _     __     __              
  //    _____(_)___/ /__  / /_  ____ ______
  //   / ___/ / __  / _ \/ __ \/ __ `/ ___/
  //  (__  ) / /_/ /  __/ /_/ / /_/ / /    
  // /____/_/\__,_/\___/_.___/\__,_/_/     

  gulp.task('generate-urls', ['sitemap'], function(){
    return gulp.src(config.distDir + '/**/*.html')
      .pipe(print())
      .pipe(directoryMap({
        filename: config.urlsPath,
        prefix: process.env.NODE_ENV === 'production' ? packageJSON.name : ''
      }))
      .pipe(gulp.dest(config.distDir));
  });

  gulp.task('sidebar', ['generate-urls'], function(){
    // note.. this is dumb. namespacing logic needs to be replaced with a modified version of gulp-prefix
    if (process.env.NODE_ENV === 'production')
      var formattedJSON = JSON.parse(fs.readFileSync(path.join(config.distDir, config.urlsPath), 'utf8'))[packageJSON.name]
    else
      var formattedJSON = JSON.parse(fs.readFileSync(path.join(config.distDir, config.urlsPath), 'utf8'))

    return gulp.src(config.sidebarTemplate)
      .pipe(jade({
        basedir: 'app',
        data: {urls: formattedJSON}
      }))
      .pipe(gulp.dest(config.templatesDistDir))
      .on('error', gutil.log);
  });

  gulp.task('inject-sidebar', ['sidebar'], function(){
    return gulp.src(config.distDir + '/**/*.html')
      // this does not appear to be working
      .pipe(inject(gulp.src(config.sidebar), {
        name: 'sidebar',
        transform: function (filePath, file) {
          // return file contents as string
          return file.contents.toString('utf8')
        }
      }))
      .pipe(gulp.dest(config.distDir))
      .on('error', gutil.log);
  });


  //    __                       __      __           
  //   / /____  ____ ___  ____  / /___ _/ /____  _____
  //  / __/ _ \/ __ `__ \/ __ \/ / __ `/ __/ _ \/ ___/
  // / /_/  __/ / / / / / /_/ / / /_/ / /_/  __(__  ) 
  // \__/\___/_/ /_/ /_/ .___/_/\__,_/\__/\___/____/  
  //                  /_/                             

  // Let's take all of the jade templates and markdown files, pre-process them,
  // and story them in .tmp
  gulp.task('jade', ['clean'], function(){
    return gulp.src(config.templatesDir + '/**/*.jade')
      .pipe(jade({
          basedir: config.templatesBaseDir,
          pretty: true
        }))
      .pipe(gulp.dest(config.templatesDistDir));

  });

  gulp.task('markdown', ['clean'], function(){
    return gulp.src(config.templatesDir + '/**/*.md')
      .pipe(markdown())
      .pipe(es.map(function(file, cb) {

        var html = jadeEngine.renderFile(config.markdownLayout, {
          basedir: config.templatesBaseDir,
          pretty: true,
            content: file.contents.toString('utf8')
          
        });
        file.contents = new Buffer(html);
        cb(null, file);
      }))
      .pipe(gulp.dest(config.templatesDistDir));
  })


  gulp.task('templates', ['jade', 'markdown'], function(){
    return gulp.src(config.templatesDir + '/**/*.html')
      .pipe(gulp.dest(config.templatesDistDir));

  });


  //          __        __         
  //    _____/ /___  __/ /__  _____
  //   / ___/ __/ / / / / _ \/ ___/
  //  (__  ) /_/ /_/ / /  __(__  ) 
  // /____/\__/\__, /_/\___/____/  
  //          /____/               

  // Let's crunch *local* styles (non-ghost-shield) 
  // in app/styles/main.scss and put them .tmp/styles
  gulp.task('styles', ['clean'], function () {
    return gulp.src(config.stylesDir)
      .pipe(sass({
        // gulp-sass was blowing up without the next two line
        sourceComments: 'map', 
        sourceMap: 'sass', 
        style: 'expanded',
        // include boubon (for local styles only)
        includePaths: require('node-bourbon').includePaths 
      }))
      .pipe(autoprefixer('last 1 version'))
      .pipe(gulp.dest(config.stylesDistDir))
      .pipe(size());
  });

  //        _     
  //       (_)____
  //      / / ___/
  //     / (__  ) 
  //  __/ /____/  
  // /___/        

  // Just run everything through JS Hint.
  // Don't move the files though. We'll do that later.
  gulp.task('scripts', ['clean'], function () {
    return gulp.src(config.jsDir)
      .pipe(jshint())
      .pipe(jshint.reporter(jshintStylish))
      .pipe(size());
  });


  //                                    ____
  //   __  __________        ________  / __/
  //  / / / / ___/ _ \______/ ___/ _ \/ /_  
  // / /_/ (__  )  __/_____/ /  /  __/ __/  
  // \__,_/____/\___/     /_/   \___/_/     
                                                                                             
  // This task does a number of things. It's responsible for
  // calling useref, which 
  //    * looks at the build directives in the html,
  //    * concatenates all of the files,
  //    * replaces the multiple refs with a ref to the build file,
  //    * and copies the build file to dist
  // 
  // We also use gulp-filter to grab just the JS and just the CSS
  // optimize, minify, etc.

  gulp.task('use-ref', ['templates', 'styles', 'scripts'], function () {
    // quick error handler for gulp-plumber
    var onError = function (err) {
      console.error(err);
      throw err;
    };

    // grab all the html in .tmp
    return gulp.src(config.assetBuildDir)
      
      // added gulp-plumber here since you'll often need
      // more info on why these stream failed
      .pipe(plumber({
        errorHandler: onError
      }))

      // useref all the html, and look in app and .tmp
      // for files references in the html
      .pipe(useref.assets({
        searchPath: config.userefSearchPath
      }))


      // uglify if it's js, optimize if it's css
      .pipe(gulpIf('**/*.js', uglify()))
      .pipe(gulpIf('**/*.css', csso()))
      
      // useref requires a call to restore() and useref()
      // when you're done
      .pipe(useref.restore())
      .pipe(useref())

      // throw it all into dist
      .pipe(gulp.dest(config.distDir))
      .pipe(size());
  });


  //     _                                
  //    (_)___ ___  ____ _____ ____  _____
  //   / / __ `__ \/ __ `/ __ `/ _ \/ ___/
  //  / / / / / / / /_/ / /_/ /  __(__  ) 
  // /_/_/ /_/ /_/\__,_/\__, /\___/____/  
  //                   /____/             

  // Look in both local app/images and ghost-shield for images,
  // optimize them and put them in dist/images
  gulp.task('images', ['cname', 'use-ref', 'fonts'],  function () {
    return gulp.src(config.imagesDir)
      // .pipe(cache(imagemin({
      //   optimizationLevel: 3,
      //   progressive: true,
      //   interlaced: true
      // })))
      .pipe(gulp.dest(config.imagesDistDir))
      .pipe(size());
  });


  //     ____            __      
  //    / __/___  ____  / /______
  //   / /_/ __ \/ __ \/ __/ ___/
  //  / __/ /_/ / / / / /_(__  ) 
  // /_/  \____/_/ /_/\__/____/  

  // take fonts out of ghost-shield and move them to dist
  gulp.task('fonts', ['clean'], function () {
    return gulp.src(config.fontDir)
      .pipe(filter('**/*.{eot,svg,ttf,woff}'))
      .pipe(flatten())
      .pipe(gulp.dest('dist/styles'))
      .pipe(size());
  });


                                   
  //   _________  ____ _____ ___  ___ 
  //  / ___/ __ \/ __ `/ __ `__ \/ _ \
  // / /__/ / / / /_/ / / / / / /  __/
  // \___/_/ /_/\__,_/_/ /_/ /_/\___/ 
                                   
  // Copy the CNAME file over to dist
  gulp.task('cname', ['clean'], function () {
    return gulp.src(config.cname)
      .pipe(gulp.dest(config.distDir))
      .pipe(size());
  });


  //          _ __                                 
  //    _____(_) /____        ____ ___  ____ _____ 
  //   / ___/ / __/ _ \______/ __ `__ \/ __ `/ __ \
  //  (__  ) / /_/  __/_____/ / / / / / /_/ / /_/ /
  // /____/_/\__/\___/     /_/ /_/ /_/\__,_/ .___/ 
  //                                      /_/      

  // After build-step-1 promise is resolved , we can
  // safely generate a sitemap and put it in dist
  gulp.task('sitemap', ['cname', 'use-ref', 'fonts'], function () {
    return gulp.src(config.sitemapDir, {
      read: false
    }).pipe(sitemap({
        siteUrl: config.siteUrl
    }))
    .pipe(gulp.dest(config.distDir));
  });


  //         __               
  //   _____/ /__  ____ _____ 
  //  / ___/ / _ \/ __ `/ __ \
  // / /__/ /  __/ /_/ / / / /
  // \___/_/\___/\__,_/_/ /_/                            

  gulp.task('clean', function () {
    return gulp.src(config.cleanDir, { read: false }).pipe(rimraf());
  });


  //                      _____                       __    
  //     ____  ________  / __(_)  __      __  _______/ /____
  //    / __ \/ ___/ _ \/ /_/ / |/_/_____/ / / / ___/ / ___/
  //   / /_/ / /  /  __/ __/ />  </_____/ /_/ / /  / (__  ) 
  //  / .___/_/   \___/_/ /_/_/|_|      \__,_/_/  /_/____/  
  // /_/                                                    

  gulp.task('prefix-urls', ['cname', 'use-ref', 'fonts', 'inject-sidebar'], function(){
    var prefixUrl = "http://swayze.io/" + packageJSON.name;

    return gulp.src(config.distDir + '/**/*.html')
      .pipe(prefix(prefixUrl, null, true))
      .pipe(gulp.dest(config.distDir));
  });


  //     __          _ __    __             
  //    / /_  __  __(_) /___/ /
  //   / __ \/ / / / / / __  /
  //  / /_/ / /_/ / / / /_/ /
  // /_.___/\__,_/_/_/\__,_/    

  gulp.task('build', ['cname', 'use-ref', 'fonts', 'inject-sidebar', 'images', 'prefix-urls']);


  //        __           __                                 __ 
  //   ____/ /__  ____  / /___  __  ______ ___  ___  ____  / /_
  //  / __  / _ \/ __ \/ / __ \/ / / / __ `__ \/ _ \/ __ \/ __/
  // / /_/ /  __/ /_/ / / /_/ / /_/ / / / / / /  __/ / / / /_  
  // \__,_/\___/ .___/_/\____/\__, /_/ /_/ /_/\___/_/ /_/\__/  
  //          /_/            /____/                            

  // this task relies on the build-step-2 task having run, which will
  // have triggered all other relevant build tasks. It takes everything
  // in dist and commits it to gh-pages and pushes.
  // 
  // deploy script from: https://github.com/X1011/git-directory-deploy
  gulp.task('deploy', ['build'], function() {
    var deployPromise = Q.defer();
    exec(config.deployCommand, function(err){
      deployPromise.resolve();
    });


    return deployPromise.promise;
  });


  //     __                 __       __         
  //    / /___  _________ _/ /  ____/ /__ _   __
  //   / / __ \/ ___/ __ `/ /  / __  / _ \ | / /
  //  / / /_/ / /__/ /_/ / /  / /_/ /  __/ |/ / 
  // /_/\____/\___/\__,_/_/   \__,_/\___/|___/  
                                             
  // Mostly the same ol' same ol' local dev tasks you know and love.
  gulp.task('connect', function () {
    var connect = require('connect');
    var app = connect()
      .use(connect.static('app'))
      // look in ghost shield too! XD
      .use(connect.static('app/bower_components/ghost-shield/dist'))
      .use(connect.static('dist'))
      .use(connect.directory('app'));

    require('http').createServer(app)
      .listen(9000)
      .on('listening', function () {
        console.log('Started connect web server on http://0.0.0.0:9000');
      });
  });

  gulp.task('serve', ['connect', 'styles', 'inject-sidebar'], function () {
    require('opn')('http://0.0.0.0:9000');
  });

  gulp.task('watch', ['connect', 'serve'], function () {
    var server = livereload();
    // watch for changes

    gulp.watch([
      '.tmp/**/*.html',
      'app/*.html',
      '.tmp/styles/**/*.*',
      'app/scripts/**/*.js',
      'app/images/**/*'
    ]).on('change', function (file) {
      server.changed(file.path);
    });

    gulp.watch('app/templates/**/*', ['inject-sidebar']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
  });

  outerGulp.tasks = assign({}, gulp.tasks, outerGulp.tasks);

}