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
        'build/modules/icon/js/notific8-icon.js':
          'modules/icon/coffee/notific8-icon.coffee'
        'build/modules/image/js/notific8-image.js':
          'modules/image/coffee/notific8-image.coffee'
        'build/modules/closeall/js/notific8-closeall.js':
          'modules/closeall/coffee/notific8-closeall.coffee'
    spec:
      options:
        bare: true
        sourceMap: false
      files:
        'spec/notific8Spec.js': 'spec/notific8Spec.coffee'
        'modules/image/spec/notific8-imageSpec.js':
          'modules/image/spec/notific8-imageSpec.coffee'
        'modules/icon/spec/notific8-iconSpec.js':
          'modules/icon/spec/notific8-iconSpec.coffee'
        'modules/closeall/spec/notific8-closeallSpec.js':
          'modules/closeall/spec/notific8-closeallSpec.coffee'
  )

  grunt.loadNpmTasks 'grunt-contrib-coffee'
