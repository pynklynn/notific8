###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('coffee',
    compile:
      options:
        sourceMap: true
        bare: true
      files:
        'build/js/jquery.notific8.js': 'src/coffee/jquery.notific8.coffee'
  )

  grunt.loadNpmTasks 'grunt-contrib-coffee'
