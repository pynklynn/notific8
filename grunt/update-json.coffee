###
# @author Will Steinmetz
# jQuery notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2015, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('update_json',
    options:
      src: 'package.json'
      indent: '  '
    bower:
      src: 'package.json'
      dest: 'bower.json'
      fields: 'version'
    jquery:
      src: 'package.json'
      dest: 'notific8.jquery.json'
      fields: 'version'
  )

  grunt.loadNpmTasks 'grunt-update-json'
