###
# @author Will Steinmetz
# notific8 Javascript plug-in - build task
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config('coffee',
    compile:
      options:
        sourceMap: true
        bare: true
      files:
        'build/js/jquery.notific8.js': 'src/coffee/jquery.notific8.coffee'
        'build/js/notific8.js': 'src/coffee/notific8.coffee'
        'build/modules/js/notific8-module.icon.js': 'src/modules/icon/coffee/notific8-module.icon.coffee'
    spec:
      options:
        bare: true
        sourceMap: false
      files:
        'spec/notific8Spec.js': 'spec/notific8Spec.coffee'
  )

  grunt.loadNpmTasks 'grunt-contrib-coffee'
