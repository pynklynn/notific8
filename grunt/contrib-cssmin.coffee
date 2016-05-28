###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('cssmin',
    minify:
      expand: true
      files:
        'dist/notific8.min.css': [ 'build/css/notific8.css' ]
        'dist/jquery.notific8.min.css': [ 'build/css/notific8.css' ]
        'dist/notific8-module.icon.min.css': [ 'build/modules/css/notific8-module.icon.css' ]
        'dist/notific8-full.min.css': [
          'build/css/notific8.css'
          'build/modules/css/notific8-module.icon.css'
        ]
    add_banner:
      options:
        banner: "/**\n\
* @author Will Steinmetz\n\
* Notification plug-in inspired by the notification style of Windows 8\n\
* Copyright (c)2013-2016, Will Steinmetz\n\
* Licensed under the BSD license.\n\
* http://opensource.org/licenses/BSD-3-Clause\n\
*/"
      files:
        'dist/notific8.min.css': [ 'dist/notific8.min.css' ]
        'dist/jquery.notific8.min.css': [ 'dist/jquery.notific8.min.css' ]
        'dist/notific8-module.icon.min.css': [ 'dist/notific8-module.icon.min.css' ]
        'dist/notific8-full.min.css': [ 'dist/notific8-full.min.css' ]
  )

  grunt.loadNpmTasks 'grunt-contrib-cssmin'
