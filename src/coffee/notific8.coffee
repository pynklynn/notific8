###
@author Will Steinmetz
notific8 Javascript plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

notific8 = do ->
  # set up the defaults
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
    namespace: 'notific8'
    queue: false
    height:
      atomic: 70
      chicchat: 120
      legacy: 90
      materialish: 48

  # modules registered with the system
  window.notific8RegisteredModules =
    beforeContent: []
    afterContent: []
    beforeContainer: []
    afterContainer: []
    insideContainer: []

  # queue for keeping track of animations
  window.notific8Queue = []

  # data store for notifications since session storage can't handle functions
  window.notific8DataStore = {}

  # handlers for the container events
  window.notific8ContainerHandlers =
    onContainerCreate: []

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
    { verticalEdge, horizontalEdge, namespace } = data.settings
    containerClass = ".#{namespace}-container.#{verticalEdge}.#{horizontalEdge}"
    document.querySelector(containerClass)

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
    generatedNotificationClasses = notificationClasses(data)
    notification = """
<div class="$notificationClasses" id="#{notificationId}">
"""
    for module in notific8RegisteredModules.beforeContent
      moduleResults = module.callbackMethod(data)
      generatedNotificationClasses = generatedNotificationClasses.concat(
        moduleResults.classes
      )
      notification += moduleResults.html
    notification += """
  <div class="#{data.settings.namespace}-message-content">
    #{buildHeading(data)}
    #{buildMessage(data)}
  </div>
"""
    for module in notific8RegisteredModules.afterContent
      moduleResults = module.callbackMethod(data)
      generatedNotificationClasses = generatedNotificationClasses.concat(
        moduleResults.classes
      )
      notification += moduleResults.html
    notification += """
  #{buildClose(data)}
</div>
"""

    notification = notification.replace(
      '$notificationClasses'
      generatedNotificationClasses.join(' ')
    )

    # add the notification to the stack
    container.innerHTML += notification
    setTimeout (->
      notification = document.getElementById(notificationId)
      notification.style.height = "#{data.settings.height}px"
    ), 1

    # call the onCreate handlers if any exists
    if data.settings.onCreate.length
      for onCreate in data.settings.onCreate
        onCreate notification, data

    # slide the message onto the screen
    setTimeout (->
      notification = document.getElementById(notificationId)
      notification.className += " open"
      notific8DataStore[notificationId] = data
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

  buildMessage = (data) ->
    """
<div class="#{data.settings.namespace}-message">
#{data.message}
</div>
"""

  notificationClasses = (data) ->
    classes = [
      "#{data.settings.namespace}-notification"
      "family-#{data.settings.theme}"
      data.settings.color
    ]

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
    ((notification, notificationId) ->
      container = getContainer(data)
      container.removeChild notification
      delete notific8DataStore[notificationId]
      if data.settings.onClose.length
        for onClose in data.settings.onClose
          onClose notification, data

      if notific8Defaults.queue && notific8Queue.length
        next = notific8Queue.shift()
        notific8 next.message, next.options

      return
    )(n, notificationId)

    return

  ###
  Set up the configuration settings
  @param object options
  ###
  configure = (options) ->
    for key, option of options
      if ['onInit', 'onCreate', 'onClose'].indexOf(key) > -1
        if typeof option == 'function'
          notific8Defaults[key].push option
        else
          notific8Defaults[key] = notific8Defaults[key].concat(option)
      else if key == 'onContainerCreate'
        if typeof option == 'function'
          notific8ContainerHandlers.onContainerCreate.push option
        else
          notific8ContainerHandlers.onContainerCreate =
            notific8ContainerHandlers.onContainerCreate.concat(option)
      else
        notific8Defaults[key] = option
    return

  ###
  Remove the currently visible notifications from the screen
  @param object options
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
    arrayKeys = [
      'onInit'
      'onCreate'
      'onClose'
    ]
    for key, option of notific8Defaults
      data.settings[key] = option unless key == 'height'
    for key, option of options
      if arrayKeys.indexOf(key) > -1
        option = [ option ] if typeof option == 'function'
        for handler in option
          data.settings[key].push handler
      else
        data.settings[key] = option

    # remove properties that are handled by the defaults
    # delete data.settings.queue # queue is handled as part of the defaults
    propertiesToRemove = [ 'onContainerCreate', 'queue' ]
    delete data.settings[prop] for prop in propertiesToRemove

    unless data.settings.height?
      data.settings.height = notific8Defaults.height[data.settings.theme]
    data.settings.height = Number(data.settings.height)
    if data.settings.height < notific8Defaults.height[data.settings.theme]
      data.settings.height = notific8Defaults.height[data.settings.theme]

    buildNotification data

    if data.settings.onInit.length
      for onInit in data.settings.onInit
        onInit data

    return

  ###
  Initialize the containers for the plug-in
  @param object options
  ###
  initContainers = (options) ->
    body = document.getElementsByTagName('body')[0]
    body.dataset.notific8s = 0
    containerClasses = [ "#{options.namespace}-container" ]
    containerStr = ""
    for module in notific8RegisteredModules.beforeContainer
      moduleResults = module.callbackMethod(notific8Defaults)
      containerClasses = containerClasses.concat(
        moduleResults.classes
      )
      containerStr += moduleResults.html
    containerStr += "<div class=\"$classes $pos\">"
    for module in notific8RegisteredModules.insideContainer
      moduleResults = module.callbackMethod(notific8Defaults)
      containerClasses = containerClasses.concat(
        moduleResults.classes
      )
      containerStr += moduleResults.html
    containerStr += "</div>"
    for module in notific8RegisteredModules.afterContainer
      moduleResults = module.callbackMethod(notific8Defaults)
      containerClasses = containerClasses.concat(
        moduleResults.classes
      )
      containerStr += moduleResults.html
    for position in [ 'top right', 'top left', 'bottom right', 'bottom left' ]
      modifiedContainerStr = containerStr
        .replace('$pos', position)
        .replace('$classes', containerClasses.join(' '))
      tempDoc = document.implementation.createHTMLDocument('tempDoc')
      tempDoc.body.innerHTML = modifiedContainerStr
      document.body.appendChild tempDoc.body.firstChild
    for container in document.getElementsByClassName(containerClasses[0])
      container.style.zIndex = notific8Defaults.zindex
      for handler in notific8ContainerHandlers.onContainerCreate
        handler container, options
      container.addEventListener "click", (event) ->
        target = event.target
        notification = target.parentElement
        notificationClass = "#{options.namespace}-notification"
        if notification.className.split(' ').indexOf(notificationClass) == -1
          return
        data = notific8DataStore[notification.id]
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
      errorMessage "moduleName should be a string"
    validPositions = [
      'beforeContent'
      'afterContent'
      'beforeContainer'
      'afterContainer'
      'insideContainer'
    ]
    unless typeof position == 'string' && validPositions.indexOf(position) > -1
      errorMessage "position should be a string"
    unless typeof defaultOptions == 'object'
      errorMessage "defaultOptions should be an object"
    unless typeof callbackMethod == 'function'
      errorMessage "callbackMethod should be an function"

    # make sure the module is not registered yet
    for module in notific8RegisteredModules[position]
      if module.moduleName == moduleName
        errorMessage "Module '#{moduleName}' has already been registered"

    # register the defaultOptions
    for option, defaultValue of defaultOptions
      notific8Defaults[option] = defaultValue

    # add the module to the collection
    notific8RegisteredModules[position].push { moduleName, callbackMethod }

  ###
  Displays an error message to the console and throws an error
  @param string message
  ###
  errorMessage = (message) ->
    console.error message
    throw new Error(message)

  # return the public method
  (message, options) ->
    unless typeof message is "string"
      errorMessage "notific8 takes a string message as the first parameter"

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
          errorMessage "Registering a module requires the parameters \
            moduleName, position, defaultOptions, and callbackMethod."
        [ message
          moduleName
          position
          defaultOptions
          callbackMethod ] = arguments

        registerModule moduleName, position, defaultOptions, callbackMethod
      else
        # make sure that the stack containers exist
        containerClass = "#{options.namespace}-container"
        if document.getElementsByClassName(containerClass).length is 0
          initContainers(options)

        # make sure the edge settings exist
        checkEdges options

        notificationClass = "#{options.namespace}-notification"
        num = document.getElementsByClassName(notificationClass).length
        if !notific8Defaults.queue || num == 0
          init message, options
        else
          notific8Queue.push { message, options }

        return
