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
      'modules/**/build'
    ]
    js: [
      'build/js'
      'dist/*.js'
      'dist/*.js.map'
      'modules/**/build/js'
    ]
    css: [
      'build/css'
      'dist/*.css'
      'dist/*.css.map'
    ]
    release: [
      'src/sass-format/**/*.sass'
      'src/stylus/**/*.styl'
      'src/less/**/*.less'
    ]
    stylus: [
      'src/stylus/src'
    ]
    less: [
      'src/less/jquery.less'
    ]
    spec: [
      'spec/**/*.js'
    ]
  )

  grunt.loadNpmTasks 'grunt-contrib-clean'
