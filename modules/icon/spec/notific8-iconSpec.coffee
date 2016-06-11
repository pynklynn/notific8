###
# @author Will Steinmetz
# Test suite for the notific8 JavaScript plug-in
# Copyright (c)2013-2016, Will Steinmetz
# Licensed under the BSD license.
# http://opensource.org/licenses/BSD-3-Clause
###

describe 'notific-icon module', ->
  beforeEach ->
    notific8 'remove'

  it 'should add an icon to the notification', ->
    notific8 'This is testing the icon module',
      icon: 'icon'

    notificationClass = "#{notific8Defaults.namespace}-notification"
    notification = document.getElementsByClassName(notificationClass)[0]
    notificationiconClass= ".#{notific8Defaults.namespace}-icon"
    notificationicon = notification.querySelectorAll(notificationiconClass)
    expect(notificationicon.length).toEqual 1
