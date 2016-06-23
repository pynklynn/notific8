###
# @author Will Steinmetz
# Test suite for the notific8 JavaScript plug-in
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

describe 'notific8 methods', ->
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

  it 'should remove the current notification', ->
    notificationClass = "#{notific8Defaults.namespace}-notification"

    notific8 'hello world!'
    notifications = document.getElementsByClassName(notificationClass)
    expect(notifications.length).toEqual 1

    notific8 'remove'
    notifications = document.getElementsByClassName(notificationClass)
    expect(notifications.length).toEqual 0

    return

  xit 'should register a new module', ->
    notific8(
      'registerModule'
      'testModule'
      'beforeContent'
      {}
      -> return
    )

    expect(notific8RegisteredModules.beforeContent.length).toEqual 3

    notific8(
      'registerModule'
      'testModule'
      'afterContent'
      {}
      -> return
    )

    expect(notific8RegisteredModules.afterContent.length).toEqual 1

    return

  return

resetOptions = ->
  # reset up the defaults
  window.notific8Defaults =
    life: 10000
    theme: 'legacy'
    color: 'teal'
    sticky: false
    verticalEdge: 'right'
    horizontalEdge: 'top'
    zindex: 1100
    closeText: 'close'
    onInit: []
    onCreate: []
    onClose: []
    onBeforeContainer: []
    onAfterContainer: []
    onInsideContainer: []
    namespace: 'notific8'
    queue: false
    height:
      atomic: 70
      chicchat: 120
      legacy: 90
      materlialish: 48

  # # reset modules registrations
  # window.notific8RegisteredModules =
  #   beforeContent: []
  #   afterContent: []

describe 'notific8 configruation setting', ->
  customConfig =
    life: 20000
    theme: 'atomic'
    color: 'pear'
    sticky: true
    verticalEdge: 'left'
    horizontalEdge: 'bottom'
    zindex: 1200
    closeText: 'exit'
    onInit: [ (data) -> ]
    onCreate: [ (notification, data) -> ]
    onClose: [ (notification, data) -> ]
    onBeforeContainer: [ (defaults) -> ]
    onAfterContainer: [ (defaults) -> ]
    onInsideContainer: [ (defaults) -> ]
    namespace: 'custom'
    queue: true
    height:
      atomic: 80
      chicchat: 80
      legacy: 80
      materialish: 80

  beforeAll ->
    resetOptions()

  it 'should set the configuration via the configure method', ->
    notific8 'configure', customConfig

    expect(notific8Defaults.life).toEqual 20000
    expect(notific8Defaults.theme).toEqual 'atomic'
    expect(notific8Defaults.color).toEqual 'pear'
    expect(notific8Defaults.sticky).toEqual true
    expect(notific8Defaults.verticalEdge).toEqual 'left'
    expect(notific8Defaults.horizontalEdge).toEqual 'bottom'
    expect(notific8Defaults.zindex).toEqual 1200
    expect(notific8Defaults.closeText).toEqual 'exit'
    expect(notific8Defaults.onInit.length).toEqual 1
    expect(notific8Defaults.onCreate.length).toEqual 1
    expect(notific8Defaults.onClose.length).toEqual 1
    expect(notific8Defaults.onBeforeContainer.length).toEqual 1
    expect(notific8Defaults.onAfterContainer.length).toEqual 1
    expect(notific8Defaults.onInsideContainer.length).toEqual 1
    expect(notific8Defaults.namespace).toEqual 'custom'
    expect(notific8Defaults.queue).toEqual true
    expect(notific8Defaults.height.atomic).toEqual 80
    expect(notific8Defaults.height.chicchat).toEqual 80
    expect(notific8Defaults.height.legacy).toEqual 80
    expect(notific8Defaults.height.materialish).toEqual 80

    return

  it 'should set the configuration via the config method', ->
    notific8 'config', customConfig

    expect(notific8Defaults.life).toEqual 20000
    expect(notific8Defaults.theme).toEqual 'atomic'
    expect(notific8Defaults.color).toEqual 'pear'
    expect(notific8Defaults.sticky).toEqual true
    expect(notific8Defaults.verticalEdge).toEqual 'left'
    expect(notific8Defaults.horizontalEdge).toEqual 'bottom'
    expect(notific8Defaults.zindex).toEqual 1200
    expect(notific8Defaults.closeText).toEqual 'exit'
    expect(notific8Defaults.onInit.length).toEqual 1
    expect(notific8Defaults.onCreate.length).toEqual 1
    expect(notific8Defaults.onClose.length).toEqual 1
    expect(notific8Defaults.onBeforeContainer.length).toEqual 1
    expect(notific8Defaults.onAfterContainer.length).toEqual 1
    expect(notific8Defaults.onInsideContainer.length).toEqual 1
    expect(notific8Defaults.namespace).toEqual 'custom'
    expect(notific8Defaults.queue).toEqual true
    expect(notific8Defaults.height.atomic).toEqual 80
    expect(notific8Defaults.height.chicchat).toEqual 80
    expect(notific8Defaults.height.legacy).toEqual 80
    expect(notific8Defaults.height.materialish).toEqual 80

    return

  return

describe 'testing notification settings on notification initialization', ->
  notificationClass = "#{notific8Defaults.namespace}-notification"

  beforeEach ->
    resetOptions()
    notific8 'remove'

  it 'should set the heading option', ->
    notific8 'This is testing the heading option.',
      heading: 'This is a heading'

    notification = document.getElementsByClassName(notificationClass)[0]
    notificationHeaderClass= ".#{notific8Defaults.namespace}-heading"
    notificationHeader = notification.querySelectorAll(notificationHeaderClass)
    expect(notificationHeader.length).toEqual 1

    return

  it 'should set the sticky option', ->
    notific8 'This is testing the sticky option',
      sticky: true

    notification = document.getElementsByClassName(notificationClass)[0]
    expect(notification.classList.contains('sticky')).toEqual true

    return

  it 'should set the closeText option', ->
    notific8 'This is testing the closeText option',
      sticky: true
      closeText: 'exit'

    notification = document.getElementsByClassName(notificationClass)[0]
    notificationCloseClass= ".#{notific8Defaults.namespace}-close"
    notificationClose = notification.querySelector(notificationCloseClass)
    expect(notificationClose.innerText).toEqual 'exit'

  it 'should set the theme', ->
    notific8 'This is testing the theme option',
      theme: 'materialish'

    notification = document.getElementsByClassName(notificationClass)[0]
    expect(notification.classList.contains('family-materialish')).toEqual true

  it 'should set the theme color', ->
    notific8 'This is testing the theme color option',
      theme: 'materialish',
      color: 'lilrobot'

    notification = document.getElementsByClassName(notificationClass)[0]
    expect(notification.classList.contains('family-materialish')).toEqual true
    expect(notification.classList.contains('lilrobot')).toEqual true

  it 'should set the queue configuration option to true', ->
    expect(notific8Defaults.queue).toEqual false
    notific8 'config', queue: true
    expect(notific8Defaults.queue).toEqual true

  return
