###
# @author Will Steinmetz
# Notification plug-in inspired by the notification style of Windows 8
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

module.exports = (grunt) ->
  grunt.config 'concat',
    less:
      src: [
        'src/less/icons.less'
        'src/less/mixins.less'
        'src/less/variables.less'
        'src/less/notific8-base.less'
        'src/less/legacy_theme.less'
        'src/less/chicchat_theme.less'
        'src/less/atomic_theme.less'
        'src/less/materialish_theme.less'
        'src/less/default_legacy_colors.less'
        'src/less/default_chicchat_colors.less'
        'src/less/default_atomic_colors.less'
        'src/less/default_materialish_colors.less'
      ]
      dest: 'src/less/notific8.less'

  grunt.loadNpmTasks 'grunt-contrib-concat'
