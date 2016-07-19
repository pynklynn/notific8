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
      closeAllClasses = [
        "#{notific8Data.namespace}-closeall-button"
        notific8Data.closeAllTheme
        notific8Data.closeAllColor
      ]
      """
<a class="#{closeAllClasses.join(' ')}"
  href="#">
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

  ###
  Get the container that the notification is inside of
  @params object data
  @return object
  ###
  getContainer = (data) ->
    { verticalEdge, horizontalEdge, namespace } = data.settings
    containerClass = ".#{namespace}-container.#{verticalEdge}.#{horizontalEdge}"
    document.querySelector(containerClass)

  ###
  Get the number of notifications in the container
  @params object data
  @return number
  ###
  getNumberOfNotifications = (data) ->
    container = getContainer(data)
    { namespace } = data.settings
    container.querySelectorAll(".#{namespace}-notification.open").length

  ###
  Get the close all button
  @params object data
  @return object
  ###
  getCloseAllButton = (data) ->
    container = getContainer(data)
    { namespace } = data.settings
    container.querySelector(".#{namespace}-closeall-button")

  # configure the onCreate event handler
  notific8(
    'configure'
    onCreate: (notification, data) ->
      return unless notific8Defaults.closeAll
      if getNumberOfNotifications(data) > 0
        closeButton = getCloseAllButton(data)
        closeButton.style.display = 'block'
  )

  # configure the onClose event handler
  notific8(
    'configure'
    onClose: (notification, data) ->
      return unless notific8Defaults.closeAll
      if getNumberOfNotifications(data) <= 1
        closeButton = getCloseAllButton(data)
        closeButton.style.display = 'none'
  )

  # configure the onContainerCreate event handler
  notific8(
    'configure'
    onContainerCreate: (container, options) ->
      containerPosition = ''
      containerClasses = container.className.split(' ')
      containerPosition += if containerClasses.indexOf('top') > -1
        'top'
      else
        'bottom'
      containerPosition += if containerClasses.indexOf('right') > -1
        'Right'
      else
        'Left'

      container.addEventListener "click", (event) ->
        event.preventDefault()

        target = event.target
        { namespace } = options
        closeAllButtonClass = "#{namespace}-closeall-button"
        if target.className.split(' ').indexOf(closeAllButtonClass) == -1
          return

        notificationClass = ".#{namespace}-notification.open"
        notifications = container.querySelectorAll(notificationClass)

        for notification in notifications
          ((n, namespace) ->
            n.querySelector(".#{namespace}-close").click()
          )(notification, namespace)
        return
  )

  # register the closeAll module
  notific8(
    'registerModule'
    'closeall'
    'insideContainer'
    {
      closeAll: false
      closeAllText: 'Close All'
      closeAllTheme: 'legacy'
      closeAllColor: 'teal'
    }
    closeAllCallback
  )
