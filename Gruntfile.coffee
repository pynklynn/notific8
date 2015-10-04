###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.initConfig(
    pkg: require('./package.json')
  )

  grunt.loadTasks 'grunt'

  grunt.registerTask 'default', [
    'clean:all',
    'sass',
    'cssmin',
    'coffee',
    'uglify',
    'copy:font'
    'copy:code'
  ]
