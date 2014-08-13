#! /usr/bin/env node

'use strict';

var ghostHelm = require('./'),
    gulp = require('gulp'),
    exec = require('child_process').exec;

var userArgs = process.argv;
var searchParam = userArgs[2];

if (userArgs.indexOf('-h') !== -1 || userArgs.indexOf('--help') !== -1 || searchParam === undefined) {
  return console.log('cli help');
}

if (userArgs.indexOf('-v') !== -1 || userArgs.indexOf('--version') !== -1) {
  return console.log(require('./package').version);
}

if (userArgs.indexOf('build') !== -1) {
  ghostHelm.setup({}, gulp);
  return gulp.start('build');
}

if (userArgs[2] == 'run' && userArgs[3] !== undefined) {
  ghostHelm.setup({}, gulp);
  return gulp.start(userArgs[3]);
}