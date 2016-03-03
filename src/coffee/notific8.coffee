###
@author Will Steinmetz
Notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

notific8 = do ->
  # set up the defaults
  # settings =
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

  # methods = do ->

  ###
  Destroy the notification
  @param object options
  ###
  destroy = (options) ->
    $(window).unbind ".notific8"
    $(".#{options.namespace}-container").remove()
    return

  getContainer = (data) ->
    vEdge = data.settings.verticalEdge
    hEdge = data.settings.horizontalEdge
    namespace = data.settings.namespace
    containerClass = "#{namespace}-container #{vEdge} #{hEdge}"
    document.getElementsByClassName(containerClass)[0]
  ###
  Build the notification and add it to the screen's stack
  @param object $this
  ###
  # buildNotification = ($this) ->
  buildNotification = (data) ->
    # data = $this.data("notific8")
    # num = Number($("body").data("notific8s"))
    body = document.getElementsByTagName('body')[0]
    num = Number(body.dataset.notific8s)
    # animate = "margin-" + data.settings.verticalEdge
    # vEdge = data.settings.verticalEdge
    # hEdge = data.settings.horizontalEdge
    namespace = data.settings.namespace
    # $container = $(".#{data.settings.namespace}-container.#{vEdge}.#{hEdge}")
    # containerClass = "#{namespace}-container #{vEdge} #{hEdge}"
    # container = document.getElementsByClassName(containerClass)[0]
    container = getContainer(data)
    num += 1

    # $("body").data "notific8s", num
    body.dataset.notific8s = num

    # build the notification HTML
    # notificationId = "#{data.settings.namespace}-notification-#{num}"
    notificationId = "#{namespace}-notification-#{num}"
    notification = """
<div class="#{notificationClasses(data).join(' ')}" id="#{notificationId}">
#{buildIcon(data)}
#{buildHeading(data)}
#{buildClose(data)}
#{buildMessage(data)}
</div>
"""

    # add the notification to the stack
    # $notification = $(notification)
    # $container.append $notification
    container.innerHTML += notification

    # call the onCreate handler if it exists
    # data.settings.onCreate $notification, data if data.settings.onCreate
    #@TODO data.settings.onCreate notification, data if data.settings.onCreate

    # slide the message onto the screen
    setTimeout (->
      # $notification.addClass "open"
      notification = document.getElementById(notificationId)
      notification.className += " open"
      unless data.settings.sticky
        ((n, l) ->
          setTimeout (->
            closeNotification n, data
            return
          ), l
          return
        # ) $notification, Number(data.settings.life) + 200
        ) notification, Number(data.settings.life) + 200
      return
    ), 5

    return

  # region: boolean checkers
  hasIcon = (data) ->
    # return data.settings.hasOwnProperty("icon") and
    #   (typeof data.settings.icon is "string")

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
    # if (
    #   data.settings.hasOwnProperty("heading") and
    #   (typeof data.settings.heading is "string")
    # )
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
  @param object n
  @param object data
  ###
  closeNotification = (n, data) ->
    # n.removeClass "open"
    n.className = n.className.replace('open', '')
    # n.height 0
    n.style.height = 0
    setTimeout (->
      # n.remove()
      container = getContainer(data)
      container.removeChild n
      #@TODO data.settings.onClose n, data if data.settings.onClose
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
    $(".#{options.namespace}-notification").remove()
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
      data.settings[key] = option
    for key, option of options
      data.settings[key] = option

    buildNotification data
    #@TODO data.settings.onInit data if data.settings.onInit
    return
    # self.each ->
    #   $this = $(this)
    #   # data = $this.data("notific8")
    #   $this.data "notific8",
    #     target: $this
    #     settings: {}
    #     message: ""
    #
    #   data = $this.data("notific8")
    #   data.message = message
    #
    #   # apply the options
    #   $.extend data.settings, settings, options
    #
    #   # add the notification to the stack
    #   buildNotification $this
    #   data.settings.onInit data if data.settings.onInit
    #   return

  ###
  Initialize the containers for the plug-in
  ###
  initContainers = (options) ->
    # $body = $("body")
    # $body.data "notific8s", 0
    body = document.getElementsByTagName('body')[0]
    body.dataset.notific8s = 0
    containerClass= "#{options.namespace}-container"
    containerStr = "<div class='#{containerClass} $pos'></div>"
    parser = new DOMParser()
    # $body.append containerStr.replace('$pos', 'top right')
    # $body.append containerStr.replace('$pos', 'top left')
    # $body.append containerStr.replace('$pos', 'bottom right')
    # $body.append containerStr.replace('$pos', 'bottom left')
    body.innerHTML += containerStr.replace('$pos', 'top right')
    body.innerHTML += containerStr.replace('$pos', 'top left')
    body.innerHTML += containerStr.replace('$pos', 'bottom right')
    body.innerHTML += containerStr.replace('$pos', 'bottom left')
    # $(".#{containerClass}").css "z-index", settings.zindex
    for container in document.getElementsByClassName(containerClass)
      container.style.zIndex = notific8Defaults.zindex
      container.onclick = (event) ->
        #@TODO set up on the close button
        target = event.target
        #@TODO get the notification
        #@TODO get the container
        #@TODO get the data
        #@TODO close notification
        return
    return
    # $(".#{containerClass}").on(
    #   'click'
    #   ".#{options.namespace}-close"
    #   (e) ->
    #     $target = $(e.currentTarget)
    #     $notification = $target.closest(".#{options.namespace}-notification")
    #     $container = $notification.closest(".#{containerClass}")
    #     data = $container.data('notific8')
    #     closeNotification $notification, data
    #     return
    # )
    # return

  ###
  Make sure that the edge options are ok
  @param object options
  ###
  checkEdges = (options) ->
    options.verticalEdge = (
      # options.verticalEdge or settings.verticalEdge
      options.verticalEdge or notific8Defaults.verticalEdge
    ).toLowerCase()
    options.horizontalEdge = (
      # options.horizontalEdge or settings.horizontalEdge
      options.horizontalEdge or notific8Defaults.horizontalEdge
    ).toLowerCase()
    if (
      (options.verticalEdge isnt "right") and
      (options.verticalEdge isnt "left")
    )
      options.verticalEdge = notific8Defaults.verticalEdge
    if (
      (options.horizontalEdge isnt "top") and
      (options.horizontalEdge isnt "bottom")
    )
      options.horizontalEdge = notific8Defaults.horizontalEdge
    return

    # init: init
    # destroy: destroy
    # configure: configure
    # zindex: zindex
    # initContainers: initContainers
    # checkEdges: checkEdges
    # remove: remove

  # return the public method
  (message, options) ->
    console.log "message: ", message
    console.log "options: ", options
    # if typeof message is "string"
    #   methods.init.apply @, arguments
    # else
    console.error """
jQuery.notific8 takes a string message as the first parameter
""" unless typeof message is "string"

    options = {} unless options?
    unless options.hasOwnProperty('namespace') || message == 'zindex'
      options.namespace = 'notific8'

    switch message
      when "configure", "config"
        # return methods.configure(options)
        return configure(options)
      when "zindex"
        # return methods.zindex(options)
        return zindex(options)
      when "destroy"
        return methods.destroy.apply(@, [options])
      when "remove"
        return methods.remove.apply(@, [options])
      else
        # make sure that the stack containers exist
        containerClass = "#{options.namespace}-container"
        # methods.initContainers(options) if $(".#{containerClass}").size() is 0
        if document.getElementsByClassName(containerClass).length is 0
          initContainers(options)

        # make sure the edge settings exist
        # methods.checkEdges options
        checkEdges options
        #
        # #display the notification in the right corner
        # vEdge = options.verticalEdge
        # hEdge = options.horizontalEdge
        # $(".#{containerClass}.#{vEdge}.#{hEdge}").notific8(
        #   message
        #   options
        # )
        init message, options
        return
    # return
