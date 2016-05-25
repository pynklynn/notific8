###
# @author Will Steinmetz
# JavaScript notification plug-in initially inspired by the notification style
# of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('jasmine',
    notific8:
      src: 'dist/notific8.js'
      options:
        specs: 'spec/*Spec.js'
  )

  grunt.loadNpmTasks 'grunt-contrib-jasmine'
