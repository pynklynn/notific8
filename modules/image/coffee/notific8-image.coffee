###
@author Will Steinmetz
Image module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

do (window) ->
  notific8Data = null

  ###
  Check whether or not a valid image is set for this notification
  @return boolean
  ###
  hasImage = () ->
    notific8Data.settings.image? and (typeof notific8Data.settings.image is "string")

  ###
  Build the HTML for the image
  @return string
  ###
  buildHtml = () ->
    if hasImage()
      """
<div class="#{notific8Data.settings.namespace}-image">
  <img src="#{notific8Data.settings.image}" alt="notification">
</div>
"""

    else
      ""

  ###
  Build the array of classes that need to be attached to the notification
  @return array
  ###
  buildClasses = () ->
    if hasImage()
      return [ "has-image" ]
    []

  ###
  Setup the callback for the notification
  @return object
  ###
  imageCallback = (data) ->
    notific8Data = data

    classes: buildClasses()
    html: buildHtml()

  notific8(
    'registerModule'
    'image'
    'beforeContent'
    { image: false }
    imageCallback
  )
