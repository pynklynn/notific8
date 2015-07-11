###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('watch',
    css:
      files: [
        'src/sass/*.scss',
        'src/css/*.css',
        'src/css/!*.min.css'
      ]
      tasks: ['sass', 'cssmin']
      options:
        spawn: false
    coffee:
      files: ['src/coffee/*.coffee']
      tasks: ['coffee', 'uglify']
      options:
        spawn: false
  )

  grunt.loadNpmTasks 'grunt-contrib-watch'
