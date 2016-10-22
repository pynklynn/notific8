/*
 * @author Will Steinmetz
 * notific8 Javascript plug-in - build task
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */

module.exports = {
  'default': [
    'clean:all',
    'build',
    'karma:unit',
    'watch'
  ],
  'build': [
    'pug',
    'sass',
    'babel:build'
  ],
  'release': [
    'clean:release',
    'build',
    'update_json',
    'uglify',
    'cssmin'
  ],
  'alternate-styles': [
    // for some reason this is not running properly when called from here and
    // and has to be called separately
    // 'sass2stylus',
    'scss2less',
    'concat:less',
    'replace:less',
    'sass-convert',
    // 'clean:stylus',
    'clean:less'
  ]
};
