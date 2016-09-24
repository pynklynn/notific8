/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  all: [
    'dist',
    'build',
    'src/sass-format/**/*.sass',
    'src/stylus/**/*.styl',
    'src/less/**/*.less',
    'karma_tests',
  ],
  js: [
    'build/js',
    'dist/**/*.js*',
  ],
  css: [
    'build/css',
    'dist/**/*.css*',
  ],
  release: [
    'src/sass-format/**/*.sass',
    'src/stylus/**/*.styl',
    'src/less/**/*.less',
  ],
  stylus: [
    'src/stylus/src',
  ],
  less: [
    'src/less/jquery.less',
  ],
  karma: [
    'karma_tests',
  ]
};
