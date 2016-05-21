###
@author Will Steinmetz
Notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

notific8 = do ->
  # set up the defaults
  window.notific8Defaults =
    life: 10000
    family: 'legacy'
    theme: "teal"
    sticky: false
    verticalEdge: "right"
    horizontalEdge: "top"
    zindex: 1100
    icon: false
    closeText: "close"
    onInit: null
    onCreate: null
    onClose: null
    namespace: 'notific8'
    height:
      atomic: 70
      chicchat: 120
      legacy: 90

  # modules registered with the system
  window.notific8RegisteredModules =
    beforeContent: []
    afterContent: []

  ###
  Destroy the notification
  @param object options
  ###
  destroy = (options) ->
    containerClass = "#{options.namespace}-container"
    containers = document.getElementsByClassName(containerClass)
    body = document.getElementsByTagName('body')[0]
    while containers.length > 0
      body.removeChild(containers[0])
    return

  ###
  Get the container that the notification is inside of
  @params object data
  @return object
  ###
  getContainer = (data) ->
    vEdge = data.settings.verticalEdge
    hEdge = data.settings.horizontalEdge
    namespace = data.settings.namespace
    containerClass = "#{namespace}-container #{vEdge} #{hEdge}"
    document.getElementsByClassName(containerClass)[0]

  ###
  Build the notification and add it to the screen's stack
  @param object data
  ###
  buildNotification = (data) ->
    body = document.getElementsByTagName('body')[0]
    num = Number(body.dataset.notific8s)
    namespace = data.settings.namespace
    container = getContainer(data)
    num += 1

    body.dataset.notific8s = num

    # build the notification HTML
    notificationId = "#{namespace}-notification-#{num}"
    notification = """
<div class="#{notificationClasses(data).join(' ')}" id="#{notificationId}">
  #{buildIcon(data)}
  <div class="#{data.settings.namespace}-message-content">
    #{buildHeading(data)}
    #{buildMessage(data)}
  </div>
  #{buildClose(data)}
</div>
"""

    # add the notification to the stack
    container.innerHTML += notification
    setTimeout (->
      notification = document.getElementById(notificationId)
      notification.style.height = "#{data.settings.height}px"
    ), 1

    # call the onCreate handler if it exists
    data.settings.onCreate notification, data if data.settings.onCreate

    # slide the message onto the screen
    setTimeout (->
      notification = document.getElementById(notificationId)
      notification.className += " open"
      sessionStorage[notificationId] = JSON.stringify(data)
      unless data.settings.sticky
        ((n, l) ->
          setTimeout (->
            closeNotification notificationId, data
            return
          ), l
          return
        ) notification, Number(data.settings.life) + 200
      return
    ), 5

    return

  # region: boolean checkers
  hasIcon = (data) ->
    data.settings.icon? and (typeof data.settings.icon is "string")
  # end region: boolean checkers

  # region: generators
  buildClose = (data) ->
    close = "<div class=\"#{data.settings.namespace}-close"
    if data.settings.sticky
      close += ' sticky">'
      close += "#{data.settings.closeText}"
    else
      close += '">&times;'
    close += '</div>'

    close

  buildHeading = (data) ->
    if data.settings.heading? and (typeof data.settings.heading is "string")
      """
<div class="#{data.settings.namespace}-heading">
#{data.settings.heading}
</div>
"""
    else
      ""

  buildIcon = (data) ->
    if hasIcon(data)
      classes = [
        "#{data.settings.namespace}-icon"
        "#{data.settings.namespace}-fontastic-#{data.settings.icon}"
      ]
      """
<i class="#{classes.join(' ')}"></i>
"""
    else
      ""

  buildMessage = (data) ->
    """
<div class="#{data.settings.namespace}-message">
#{data.message}
</div>
"""

  notificationClasses = (data) ->
    classes = [
      "#{data.settings.namespace}-notification"
      "family-#{data.settings.family}"
      data.settings.theme
    ]

    if hasIcon(data)
      classes.push "has-icon"

    if data.settings.sticky
      classes.push "sticky"

    classes
  # end region: generators

  ###
  Close the given notification
  @param string notificationId
  @param object data
  ###
  closeNotification = (notificationId, data) ->
    n = document.getElementById(notificationId)
    return unless n?
    n.className = n.className.replace('open', '')
    n.style.height = 0
    setTimeout (->
      container = getContainer(data)
      container.removeChild n
      delete sessionStorage[n.id]
      data.settings.onClose n, data if data.settings.onClose
      return
    ), 200

    return

  ###
  Set up the configuration settings
  @param object options
  ###
  configure = (options) ->
    for key, option of options
      notific8Defaults[key] = option
    return

  ###
  Remove the currently visible notifications from the screen
  ###
  remove = (options) ->
    notificationClass = "#{options.namespace}-notification"
    notifications = document.getElementsByClassName(notificationClass)
    while notifications.length > 0
      notifications[0].parentNode.removeChild notifications[0]
    return

  ###
  Set up the z-index
  @param int z
  ###
  zindex = (z) ->
    notific8Defaults.zindex = z
    return

  ###
  Initialize the plug-in
  @param string message
  @param object options
  @return object
  ###
  init = (message, options) ->
    data =
      settings: {}
      message: message
    for key, option of notific8Defaults
      data.settings[key] = option unless key == 'height'
    for key, option of options
      data.settings[key] = option
    unless data.settings.height?
      data.settings.height = notific8Defaults.height[data.settings.family]
    data.settings.height = Number(data.settings.height)
    if data.settings.height < notific8Defaults.height[data.settings.family]
      data.settings.height = notific8Defaults.height[data.settings.family]

    buildNotification data
    data.settings.onInit data if data.settings.onInit
    return

  ###
  Initialize the containers for the plug-in
  @param object options
  ###
  initContainers = (options) ->
    body = document.getElementsByTagName('body')[0]
    body.dataset.notific8s = 0
    containerClass= "#{options.namespace}-container"
    containerStr = "<div class='#{containerClass} $pos'></div>"
    parser = new DOMParser()
    body.innerHTML += containerStr.replace('$pos', 'top right')
    body.innerHTML += containerStr.replace('$pos', 'top left')
    body.innerHTML += containerStr.replace('$pos', 'bottom right')
    body.innerHTML += containerStr.replace('$pos', 'bottom left')
    for container in document.getElementsByClassName(containerClass)
      container.style.zIndex = notific8Defaults.zindex
      container.addEventListener "click", (event) ->
        target = event.target
        notification = target.parentElement
        data = JSON.parse(sessionStorage[notification.id])
        closeNotification notification.id, data
        return
    return

  ###
  Make sure that the edge options are ok
  @param object options
  ###
  checkEdges = (options) ->
    options.verticalEdge = (
      options.verticalEdge or notific8Defaults.verticalEdge
    ).toLowerCase()
    options.horizontalEdge = (
      options.horizontalEdge or notific8Defaults.horizontalEdge
    ).toLowerCase()
    if (options.verticalEdge != "right") && (options.verticalEdge != "left")
      options.verticalEdge = notific8Defaults.verticalEdge
    if (options.horizontalEdge != "top") && (options.horizontalEdge != "bottom")
      options.horizontalEdge = notific8Defaults.horizontalEdge
    return

  ###
  Register a module for use in the system
  @param string moduleName
  @param string position
  @param object defaultOptions
  @param function callbackMethod
  ###
  registerModule = (moduleName, position, defaultOptions, callbackMethod) ->
    # double-check all of the values are correct
    unless typeof moduleName == 'string' && moduleName.trim() != ''
      errorMessage = "moduleName should be a string"
      console.error errorMessage
      throw new Error(errorMessage)
    unless typeof position == 'string' && (
      position == 'beforeContent' || position == 'afterContent'
    )
      errorMessage = "position should be a string"
      console.error errorMessage
      throw new Error(errorMessage)
    unless typeof defaultOptions == 'object'
      errorMessage = "defaultOptions should be an object"
      console.error errorMessage
      throw new Error(errorMessage)
    unless typeof callbackMethod == 'function'
      errorMessage = "callbackMethod should be an function"
      console.error errorMessage
      throw new Error(errorMessage)

    # make sure the module is not registered yet
    for module in notific8RegisteredModules[position]
      if module.moduleName == moduleName
        errorMessage = "Module '#{moduleName}' has already been registered"
        console.error errorMessage
        throw new Error(errorMessage)

    # register the defaultOptions
    for defaultValue, option in defaultOptions
      notific8Defaults[option] = defaultValue

    # add the module to the collection
    notific8RegisteredModules[position].push {
      moduleName
      callbackMethod
    }

  # return the public method
  (message, options) ->
    unless typeof message is "string"
      errorMessage = "notific8 takes a string message as the first parameter"
      console.error errorMessage
      throw new Error(errorMessage)

    options = {} unless options?
    unless options.hasOwnProperty('namespace') || message == 'zindex'
      options.namespace = 'notific8'

    switch message
      when "configure", "config"
        return configure(options)
      when "zindex"
        return zindex(options)
      when "destroy"
        return destroy(options)
      when "remove"
        return remove(options)
      when "registerModule"
        unless arguments.length == 5
          errorMessage = """
Registering a module requires the parameters moduleName, position,
 defaultOptions, and callbackMethod.
"""
          console.log errorMessage
          throw new Error(errorMessage)

        moduleName = arguments[1]
        position = arguments[2]
        defaultOptions = arguments[3]
        callbackMethod = arguments[4]

        registerModule moduleName, position, defaultOptions, callbackMethod
      else
        # make sure that the stack containers exist
        containerClass = "#{options.namespace}-container"
        if document.getElementsByClassName(containerClass).length is 0
          initContainers(options)

        # make sure the edge settings exist
        checkEdges options

        init message, options
        return
