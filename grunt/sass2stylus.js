/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

exec = require('child_process').exec;

// sass2stylus custom task
// Running this task requires Ruby and the sass2stylus gem
// see https://github.com/paulcpederson/sass2stylus
module.exports = function(grunt) {
  grunt.registerTask('sass2stylus', 'Converting Sass files to Stylus format', function() {
    console.log('Converting Sass files...');

    var puts = function(error, stdout, stderr) {
      console.log(stdout);
    };
    exec('sass2stylus src/sass/**/*.scss src/stylus', puts);
    exec('mv src/stylus/src/sass/*.styl src/stylus', puts);

    console.log('Sass files have been converted to Stylus.');
  });
};
