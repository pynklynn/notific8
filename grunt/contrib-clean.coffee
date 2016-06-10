###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('clean',
    all: [
      'dist'
      'build'
      'src/sass-format/**/*.sass'
      'src/stylus/**/*.styl'
      'src/less/**/*.less'
      'spec/**/*.js'
      'karma_tests'
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
    karma: [
      'karma_tests'
    ]
  )

  grunt.loadNpmTasks 'grunt-contrib-clean'
