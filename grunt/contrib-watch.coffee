###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('watch',
    options:
      atBegin: ['copy:font']
    sass:
      files: [
        'src/sass/*.scss'
      ]
      tasks: ['clean:css', 'sass', 'cssmin', 'copy:css']
      options:
        spawn: false
    coffee:
      files: [
        'src/coffee/*.coffee'
      ]
      tasks: ['clean:js', 'coffee', 'uglify', 'copy:js']
      options:
        spawn: false
    jade:
      files: [
        'src/jade/**/*.jade'
      ]
      tasks: ['jade']
      options:
        spawn: false
  )

  grunt.loadNpmTasks 'grunt-contrib-watch'
