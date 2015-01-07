###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('copy',
    files:
      expand: true
      src: ['src/css/fonts/*']
      dest: 'dist/fonts'
      filter: 'isFile'
      flatten: true
  )

  grunt.loadNpmTasks 'grunt-contrib-copy'
