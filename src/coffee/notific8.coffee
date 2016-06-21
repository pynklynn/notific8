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
    onInit: null
    onCreate: null
    onClose: null
    namespace: 'notific8'
    queue: false
    closeAll: false
    closeAllText: 'Close All'
    height:
      atomic: 70
      chicchat: 120
      legacy: 90
      materialish: 48

  # modules registered with the system
  window.notific8RegisteredModules =
    beforeContent: []
    afterContent: []

  # queue for keeping track of animations
  window.notific8Queue = []

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
    containerClass = "#{namespace}-container #{verticalEdge} #{horizontalEdge}"
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
    setTimeout (->
      container = getContainer(data)
      container.removeChild n
      delete sessionStorage[n.id]
      data.settings.onClose n, data if data.settings.onClose

      if notific8Defaults.queue && notific8Queue.length
        next = notific8Queue.shift()
        notific8 next.message, next.options

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
    for key, option of notific8Defaults
      data.settings[key] = option unless key == 'height'
    for key, option of options
      data.settings[key] = option
    # options that are handled by defaults
    for key in [ 'queue', 'closeAll', 'closeAllText' ]
      delete data.settings[key]
    unless data.settings.height?
      data.settings.height = notific8Defaults.height[data.settings.theme]
    data.settings.height = Number(data.settings.height)
    if data.settings.height < notific8Defaults.height[data.settings.theme]
      data.settings.height = notific8Defaults.height[data.settings.theme]

    # backwards compatibility check that will removed for version 4.0
    checkThemeOptions data

    buildNotification data
    data.settings.onInit data if data.settings.onInit
    return

  ###
  @TODO remove
  Check that the theme, color, and family options are set appropriately.
  This method will be removed for version 4.0 when the family option is removed
  and backwards compatibility will be removed.
  @param object data
  ###
  checkThemeOptions = (data) ->
    validThemes = ['legacy', 'atomic', 'chicchat', 'materialish']
    unless validThemes.indexOf(data.settings.theme) > -1
      data.settings.color = data.settings.theme
      data.settings.theme = data.settings.family
      if console? && console.warn?
        console.warn "The option 'theme' now references the value that was \
          formerly used for 'family'. The option 'color' was added in version \
          3.2.0 to replace the former functionality of the 'theme' option. The \
          'family' option and backwards compatibility will be removed in \
          version 4.0. Please update the options configuration in your code as \
          soon as possible."

  ###
  Initialize the containers for the plug-in
  @param object options
  ###
  initContainers = (options) ->
    body = document.getElementsByTagName('body')[0]
    body.dataset.notific8s = 0
    containerClass = "#{options.namespace}-container"
    closeAllButtonClass = "#{options.namespace}-close-all"
    closeAllButton = "<a href=\"javascript: void(0);\" \
      class=\"closeAllButtonClass\">\
      #{notific8Defaults.closeAllText}\
    </a>"
    containerStr = "<div class='#{containerClass} $pos'>\
      #{closeAllButton}
    \</div>"
    for position in [ 'top right', 'top left', 'bottom right', 'bottom left' ]
      body.innerHTML += containerStr.replace('$pos', position)
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
      errorMessage "moduleName should be a string"
    unless typeof position == 'string' && (
      position == 'beforeContent' || position == 'afterContent'
    )
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
