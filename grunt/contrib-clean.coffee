###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('clean',
    all: [
      'dist'
      'build'
    ]
    js: [
      'build/js'
      'dist/*.js'
      'dist/*.js.map'
    ]
    css: [
      'build/css'
      'dist/*.css'
      'dist/*.css.map'
    ]
  )

  grunt.loadNpmTasks 'grunt-contrib-clean'
