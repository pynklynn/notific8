###
@author Will Steinmetz
jQuery notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2015, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###
(($) ->
  "use strict"
  settings = undefined
  methods = undefined
  self = undefined
  supports = undefined
  settings =
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

  methods = (->

    ###
    Destroy the notification
    @param object $this
    ###
    destroy = ($this) ->
      $(window).unbind ".notific8"
      $(".jquery-notific8-container").remove()
      return

    ###
    Build the notification and add it to the screen's stack
    @param object $this
    ###
    buildNotification = ($this) ->
      data = $this.data("notific8")
      num = Number($("body").data("notific8s"))
      animate = "margin-" + data.settings.verticalEdge
      styles = {}
      vEdge = data.settings.verticalEdge
      hEdge = data.settings.horizontalEdge
      $container = $(".jquery-notific8-container.#{vEdge}.#{hEdge}")
      num += 1

      $("body").data "notific8s", num

      # build the notification HTML
      notificationId = "jquery-notific8-notification-#{num}"
      notification = """
<div class="#{notificationClasses(data).join(' ')}" id="#{notificationId}">
#{buildIcon(data)}
#{buildHeading(data)}
#{buildClose(data)}
#{buildMessage(data)}
</div>
"""

      # add the notification to the stack
      $notification = $(notification)
      $container.append $notification

      # call the onCreate handler if it exists
      data.settings.onCreate $notification, data if data.settings.onCreate

      # slide the message onto the screen
      setTimeout (->
        $notification.addClass "open"
        unless data.settings.sticky
          ((n, l) ->
            setTimeout (->
              closeNotification n, data
              return
            ), l
            return
          ) $notification, Number(data.settings.life) + 200
        return
      ), 5

      return

    # region: boolean checkers
    hasIcon = (data) ->
      return data.settings.hasOwnProperty("icon") and
        (typeof data.settings.icon is "string")
    # end region: boolean checkers

    # region: generators
    buildClose = (data) ->
      close = '<div class="jquery-notific8-close'
      if data.settings.sticky
        close += ' sticky">'
        close += "#{data.settings.closeText}"
      else
        close += '">&times;'
      close += '</div>'

      close

    buildHeading = (data) ->
      if (
        data.settings.hasOwnProperty("heading") and
        (typeof data.settings.heading is "string")
      )
        """
<div class="jquery-notific8-heading">
  #{data.settings.heading}
</div>
"""
      else
        ""

    buildIcon = (data) ->
      if hasIcon(data)
        """
<i class="jquery-notific8-icon notific8-fontastic-#{data.settings.icon}"></i>
"""
      else
        ""

    buildMessage = (data) ->
      """
<div class="jquery-notific8-message">
  #{data.message}
</div>
"""

    notificationClasses = (data) ->
      classes = [
        'jquery-notific8-notification'
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
      n.removeClass "open"
      n.height 0
      setTimeout (->
        n.remove()
        data.settings.onClose n, data if data.settings.onClose
        return
      ), 200

      return

    ###
    Set up the configuration settings
    @param object options
    ###
    configure = (options) ->
      $.extend settings, options
      return

    ###
    Remove the currently visible notifications from the screen
    ###
    remove = ->
      $(".jquery-notific8-notification").remove()
      return

    ###
    Set up the z-index
    @param int z
    ###
    zindex = (z) ->
      settings.zindex = z
      return

    ###
    Initialize the plug-in
    @param string message
    @param object options
    @return object
    ###
    init = (message, options) ->
      self.each ->
        $this = $(this)
        data = $this.data("notific8")
        $this.data "notific8",
          target: $this
          settings: {}
          message: ""

        data = $this.data("notific8")
        data.message = message

        # apply the options
        $.extend data.settings, settings, options

        # add the notification to the stack
        buildNotification $this
        data.settings.onInit data if data.settings.onInit
        return

    ###
    Initialize the containers for the plug-in
    ###
    initContainers = ->
      $body = $("body")
      $body.data "notific8s", 0
      containerStr = '<div class="jquery-notific8-container $pos"></div>'
      $body.append containerStr.replace('$pos', 'top right')
      $body.append containerStr.replace('$pos', 'top left')
      $body.append containerStr.replace('$pos', 'bottom right')
      $body.append containerStr.replace('$pos', 'bottom left')
      $('.jquery-notific8-container').css "z-index", settings.zindex
      $('.jquery-notific8-container').on(
        'click'
        '.jquery-notific8-close'
        (e) ->
          $target = $(e.currentTarget)
          $notification = $target.closest('.jquery-notific8-notification')
          $container = $notification.closest('.jquery-notific8-container')
          data = $container.data('notific8')
          closeNotification $notification, data
          return
      )
      return

    ###
    Make sure that the edge options are ok
    @param object options
    ###
    checkEdges = (options) ->
      options.verticalEdge = (
        options.verticalEdge or settings.verticalEdge
      ).toLowerCase()
      options.horizontalEdge = (
        options.horizontalEdge or settings.horizontalEdge
      ).toLowerCase()
      if (
        (options.verticalEdge isnt "right") and
        (options.verticalEdge isnt "left")
      )
        options.verticalEdge = settings.verticalEdge
      if (
        (options.horizontalEdge isnt "top") and
        (options.horizontalEdge isnt "bottom")
      )
        options.horizontalEdge = settings.horizontalEdge
      return

    ###
    Determine support for CSS3 property
    @param string prop
    ###
    css3Support = (prop) ->
      p = prop.split("-")
      pStr = ""
      i = undefined
      len = undefined
      s = document.createElement("p").style
      capitalize = undefined
      pNoPrefix = undefined
      capitalize = (l) ->
        l.charAt(0).toUpperCase() + l.slice(1)

      i = 0
      len = p.length

      while i < len
        pStr = pStr + p[i].toLowerCase().replace(/\b\w{3,}/g, capitalize)
        i = i + 1
      pNoPrefix = pStr.charAt(0).toLowerCase() + pStr.slice(1)
      supports[prop] = (
        s.hasOwnProperty(pNoPrefix) or
        s.hasOwnProperty("Webkit" + pStr) or
        s.hasOwnProperty("Moz" + pStr) or
        s.hasOwnProperty("ms" + pStr) or
        s.hasOwnProperty("O" + pStr)
      )
      return

    init: init
    destroy: destroy
    configure: configure
    zindex: zindex
    initContainers: initContainers
    checkEdges: checkEdges
    css3Support: css3Support
    remove: remove
  )()

  ###
  wrapper since this plug-in is called without selecting an element first
  @param string message
  @param object options
  ###
  $.notific8 = (message, options) ->
    switch message
      when "configure", "config"
        return methods.configure.apply(this, [options])
      when "zindex"
        return methods.zindex.apply(this, [options])
      when "destroy"
        return methods.destroy.apply(this, [options])
      when "remove"
        return methods.remove.apply(this, [options])
      else
        options = {} if typeof options is "undefined"

        # make sure that the stack containers exist
        methods.initContainers() if $(".jquery-notific8-container").size() is 0

        # make sure the edge settings exist
        methods.checkEdges options

        #display the notification in the right corner
        vEdge = options.verticalEdge
        hEdge = options.horizontalEdge
        $(".jquery-notific8-container.#{vEdge}.#{hEdge}").notific8(
          message
          options
        )

  ###
  plugin setup
  ###
  $.fn.notific8 = (message, options) ->
    self = this
    if typeof supports is "undefined"
      supports = {}
      methods.css3Support "transition"
    if typeof message is "string"
      methods.init.apply this, arguments
    else
      $.error "jQuery.notific8 takes a string message as the first parameter"
    return

  return
) jQuery
