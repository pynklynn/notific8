###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('sass',
    dist:
      options:
        style: 'compact'
      files:
        'build/css/jquery.notific8.css': 'src/sass/jquery.notific8.scss'
  )

  grunt.loadNpmTasks 'grunt-contrib-sass'
