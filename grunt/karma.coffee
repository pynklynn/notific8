###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
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
