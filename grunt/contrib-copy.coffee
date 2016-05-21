###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('copy',
    font:
      expand: true
      src: ['modules/icon/src/fonts/*']
      dest: 'dist/fonts'
      filter: 'isFile'
      flatten: true
    css:
      expand: true
      src: [
        'build/css/*.css'
        'build/css/*.css.map'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
    js:
      expand: true
      src: [
        'build/js/*.js'
        'build/js/*.js.map'
        'modules/**/build/js/*.js'
        'modules/**/build/js/*.js.map'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
    code:
      expand: true
      src: [
        'build/css/*.css'
        'build/css/*.css.map'
        'build/js/*.js'
        'build/js/*.js.map'
        'modules/**/build/js/*.js'
        'modules/**/build/js/*.js.map'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
  )

  grunt.loadNpmTasks 'grunt-contrib-copy'
