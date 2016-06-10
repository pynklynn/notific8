###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('uglify',
    options:
      mangle: true
      banner: "/**\n\
 * @author Will Steinmetz\n\
 * Notification plug-in inspired by the notification style of Windows 8\n\
 * Copyright (c)2013-2016, Will Steinmetz\n\
 * Licensed under the BSD license.\n\
 * http://opensource.org/licenses/BSD-3-Clause\n\
 */"
    my_target:
      files:
        'dist/jquery.notific8.min.js': [
          'build/js/notific8.js'
          'build/js/jquery.notific8.js'
        ]
        'dist/notific8.min.js': ['build/js/notific8.js']
        'dist/modules/icon/notific8-module.icon.min.js': [
          'build/modules/icon/js/notific8-module.icon.js'
        ]
  )

  grunt.loadNpmTasks 'grunt-contrib-uglify'
