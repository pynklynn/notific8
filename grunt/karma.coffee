###
# @author Will Steinmetz
# JavaScript notification plug-in initially inspired by the notification style
# of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('karma',
    unit:
      configFile: 'karma.conf.coffee'
      singleRun: true
  )

  grunt.loadNpmTasks 'grunt-karma'
