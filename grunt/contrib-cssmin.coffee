###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('cssmin',
    minify:
      expand: true
      files:
        'dist/jquery.notific8.min.css': ['build/css/jquery.notific8.css']
    add_banner:
      options:
        banner: "/**\n\
* @author Will Steinmetz\n\
* jQuery notification plug-in inspired by the notification style of Windows 8\n\
* Copyright (c)2013-2015, Will Steinmetz\n\
* Licensed under the BSD license.\n\
* http://opensource.org/licenses/BSD-3-Clause\n\
*/"
      files:
        'dist/jquery.notific8.min.css': ['dist/jquery.notific8.min.css']
  )

  grunt.loadNpmTasks 'grunt-contrib-cssmin'
