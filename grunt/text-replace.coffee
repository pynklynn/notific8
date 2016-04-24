###
# @author Will Steinmetz
# Notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config 'replace',
    less:
      src: ['src/less/**/*.less']
      dest: 'src/less/'
      replacements: [{
        from: /~"@notific8-ns"/g
        to: '@{notific8-ns}'
      }]

  grunt.loadNpmTasks 'grunt-text-replace'
