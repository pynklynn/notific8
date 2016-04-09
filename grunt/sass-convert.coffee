###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('sass-convert',
    options:
      from: 'scss'
      to: 'sass'
    files:
      cwd: 'src/sass'
      src: [ '*.scss' ]
      dest: 'src/sass-format'
  )

  grunt.loadNpmTasks 'grunt-sass-convert'
