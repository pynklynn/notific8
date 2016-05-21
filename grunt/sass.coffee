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
        sourceMap: true
      files:
        'build/css/jquery.notific8.css': 'src/sass/notific8.scss'
        'build/css/notific8.css': 'src/sass/notific8.scss'
        'build/modules/css/notific8-module.icon.css': 'src/modules/icon/sass/notific8-module.icon.scss'
  )

  grunt.loadNpmTasks 'grunt-sass'
