###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('copy',
    font:
      expand: true
      src: ['src/modules/icon/fonts/*']
      dest: 'dist/fonts'
      filter: 'isFile'
      flatten: true
    css:
      expand: true
      src: [
        'build/css/*.css*'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
    js:
      expand: true
      src: [
        'build/js/*.js*'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
    code:
      expand: true
      src: [
        'build/css/*.css*'
        'build/js/*.js*'
        'build/modules/icon/css/*.css*'
        'build/modules/icon/js/*.js*'
      ]
      dest: 'dist'
      filter: 'isFile'
      flatten: true
    'module-icon':
      expand: true
      src: [
        'build/modules/icon/css/*.css*'
        'build/modules/icon/js/*.js*'
      ]
      dest: 'dist/modules/icon'
      filter: 'isFile'
      flatten: true
  )

  grunt.loadNpmTasks 'grunt-contrib-copy'
