###
# @author Will Steinmetz
# Test suite for the notific8 JavaScript plug-in
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

describe 'notific8', ->
  xit 'should set the configuration via the configuration method', ->
    return

  xit 'should set the configuration via the config method', ->
    return

  it 'should set the default z-index to 5000', ->
    notific8 'zindex', 5000

    expect(notific8Defaults.zindex).toEqual 5000
    return

  it 'should destroy the notification containers', ->
    notific8 'hello world!'

    notific8 'destroy'

    containerClass = "#{notific8Defaults.namespace}-container"
    containers = document.getElementsByClassName(containerClass)

    expect(containers.length).toEqual 0
    return

  xit 'should remove the current notification', ->
    return

  xit 'should register a new module', ->
    return

  return
