###
@author Will Steinmetz
Icon module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

do (window) ->
  notific8Data = null

  ###
  Check whether or not a valid icon is set for this notification
  @return boolean
  ###
  hasIcon = () ->
    notific8Data.settings.icon? and (typeof notific8Data.settings.icon is "string")

  ###
  Build the HTML for the icon
  @return string
  ###
  buildHtml = () ->
    if hasIcon()
      classes = [
        "#{notific8Data.settings.namespace}-icon"
        "#{notific8Data.settings.namespace}-fontastic-#{notific8Data.settings.icon}"
      ]
      """
<i class="#{classes.join(' ')}"></i>
"""
    else
      ""

  ###
  Build the array of classes that need to be attached to the notification
  @return array
  ###
  buildClasses = () ->
    if hasIcon()
      return [ "has-icon" ]
    []

  ###
  Setup the callback for the notification
  @return object
  ###
  iconCallback = (data) ->
    notific8Data = data

    classes: buildClasses()
    html: buildHtml()

  notific8(
    'registerModule'
    'icon'
    'beforeContent'
    { icon: false }
    iconCallback
  )
