###
# @author Will Steinmetz
# Notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config 'scss2less',
    convert:
      files: [{
        expand: true
        cwd: 'src/sass'
        src: '**/*.scss'
        dest: 'src/less'
        ext: '.less'
        rename: (dest, src) ->
          dest + '/' + src.replace('_','')
      }]

  grunt.loadNpmTasks 'grunt-scss2less'
