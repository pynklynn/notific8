###
@author Will Steinmetz
Close all module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

do (window) ->
  notific8Data = null

  ###
  Build the HTML for close all
  @return string
  ###
  buildHtml = () ->
    if notific8Data.closeAll
      """
<a class="#{notific8Data.namespace}-closeall"
  href="javascript:void(0);">
  #{notific8Data.closeAllText}
</a>
"""
    else
      ""

  ###
  Build the classes array for close all
  @return string
  ###
  buildClasses = () ->
    if notific8Data.closeAll
      [ "#{notific8Data.namespace}-closeall" ]
    else
      []

  ###
  Setup the callback for the notification
  @return object
  ###
  closeAllCallback = (data) ->
    notific8Data = data

    classes: buildClasses()
    html: buildHtml()

  notific8(
    'registerModule'
    'closeall'
    'insideContainer'
    {
      closeAll: false
      closeAllText: 'Close All'
    }
    closeAllCallback
  )
