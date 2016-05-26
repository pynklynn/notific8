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

  grunt.registerTask 'build', [
    'pug'
    'sass'
    'cssmin'
    'coffee'
    'uglify'
    'copy:font'
    'copy:code'
  ]

  grunt.registerTask 'default', [
    'clean:all'
    'build'
    'karma:unit'
    'watch'
  ]

  grunt.registerTask 'release', [
    'clean:release'
    'build'
    'update_json'
    # for some reason this is not running properly when called from here and
    # and has to be called separately
    # 'sass2stylus'
    'scss2less'
    'concat:less'
    'replace:less'
    'sass-convert'
    # 'clean:stylus'
    'clean:less'
  ]
