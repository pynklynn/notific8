###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('uglify',
    options:
      mangle: true
      banner: "/**\n\
 * @author Will Steinmetz\n\
 * jQuery notification plug-in inspired by the notification style of Windows 8\n\
 * Copyright (c)2013-2015, Will Steinmetz\n\
 * Licensed under the BSD license.\n\
 * http://opensource.org/licenses/BSD-3-Clause\n\
 */"
    my_target:
      files:
        'dist/jquery.notific8.min.js': ['build/js/jquery.notific8.js']
  )

  grunt.loadNpmTasks 'grunt-contrib-uglify'
