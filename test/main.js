/*global describe, it*/
"use strict";

require("mocha");

var expect = require("chai").expect,
    gulp = require("gulp"),
    gutil = require("gulp-util"),
    ghostHelm = require("../"),
    fs = require('fs'),
    Q = require('q'),
    generateDeferred = Q.defer(),

    config = {
      distDir: 'test/.tmp-dist',

      templatesDir: 'test/fixtures/templates/pages',
      templatesBaseDir: 'test/fixtures/templates',
      templatesDistDir: 'test/.tmp',

      stylesDir: 'test/fixtures//styles/main.scss',
      stylesDistDir: 'test/.tmp/styles',

      jsDir: 'test/fixtures/scripts/**/*.js',

      assetBuildDir: 'test/.tmp/**/*.html',
      userefSearchPath: ['test/fixtures/','test/.tmp'],

      imagesDir: ['test/fixtures/images/**/*', 'test/fixtures/bower_components/ghost-shield/dist/images/**/*'],
      imagesDistDir: 'test/.tmp-dist/images',

      fontDir: ['test/fixtures/bower_components/ghost-shield/dist/webfonts/*'],

      cname: 'test/fixtures/CNAME',

      sitemapDir: 'test/.tmp-dist/**/*.html',
      siteUrl: 'http://theironyard.com',

      cleanDir: ['test/.tmp', 'test/.tmp-dist'],

      // deployCommand: 'sh deploy.sh',
      deployCommand: 'ls',

      urlsPath: 'urls.json',
      sidebar: 'test/.tmp/sidebar.html',
      sidebarTemplate: 'test/fixtures/templates/includes/sidebar.jade',

      markdownLayout: 'test/fixtures/templates/layouts/markdown-layout.jade'
    },

    expectedAboutContent,
    expectedIndexContent,
    expectedFaqContent,
    expectedMarkdownContent,
    expectedSidebarTestContent,
    aboutContent,
    indexContent,
    faqContent,
    markdownContent,
    sidebarTestContent;

ghostHelm.setup(config, gulp);
console.log('Ghost Helm is made possible by contributions from viewers like you.');

expectedAboutContent = fs.readFileSync('test/expected/about/index.html').toString();
expectedIndexContent = fs.readFileSync('test/expected/index.html').toString();
expectedFaqContent = fs.readFileSync('test/expected/academy/faq/index.html').toString();
expectedMarkdownContent = fs.readFileSync('test/expected/markdown.html').toString();
expectedSidebarTestContent = fs.readFileSync('test/expected/sidebar-test.html').toString();

gulp.task('generate', ['build'], function(){
  generateDeferred.resolve();
});

gulp.start('generate');

before(function(done){
  this.timeout(5000)

  generateDeferred.promise.then(function () {
    aboutContent = fs.readFileSync('test/.tmp-dist/about/index.html').toString();
    indexContent = fs.readFileSync('test/.tmp-dist/index.html').toString();
    faqContent = fs.readFileSync('test/.tmp-dist/academy/faq/index.html').toString();
    markdownContent = fs.readFileSync('test/.tmp-dist/markdown.html').toString();
    sidebarTestContent = fs.readFileSync('test/.tmp-dist/sidebar-test.html').toString();
    done();
  });

});

describe("Ghost Helm", function(){

  describe("should produce files that", function() {
    it("exactly match the expected content of the About page", function(){
      expect(aboutContent).to.equal(expectedAboutContent);
    });

    it("exactly match the expected content of the Index page", function(){
      expect(indexContent).to.equal(expectedIndexContent);
    });

    it("exactly match the expected content of the FAQ page", function(){
      expect(faqContent).to.equal(expectedFaqContent);
    }); 

    it("exactly match the expected content of the Markdown page", function(){
      expect(markdownContent).to.equal(expectedMarkdownContent);
    }); 
  });

  describe("should be able to correctly generate and inject sidebars", function() {
    it("on the sidebar-test page", function(){
      expect(sidebarTestContent).to.equal(expectedSidebarTestContent);
    });
  });
});
