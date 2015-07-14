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

      notificationClasses = [
        'jquery-notific8-notification'
        "#{data.settings.theme}"
      ]

      # check for an icon
      icon = ""
      if (
        data.settings.hasOwnProperty("icon") and
        (typeof data.settings.icon is "string")
      )
        notificationClasses.push "has-icon"
        icon = """
<i class="jquery-notific8-icon notific8-fontastic-#{data.settings.icon}"></i>
"""

      # check for a heading
      heading = ""
      if (
        data.settings.hasOwnProperty("heading") and
        (typeof data.settings.heading is "string")
      )
        heading = """
<div class="jquery-notific8-heading">
  #{data.settings.heading}
</div>
"""

      close = '<div class="jquery-notific8-close'
      if data.settings.sticky
        close += ' sticky">'
        close += "#{data.settings.closeText} <span>&times; </span>"
        notificationClasses.push "sticky"
      else
        close += '">&times;'
      close += '</div>'

      # add the message
      message = """
<div class="jquery-notific8-message">
  #{data.message}
</div>
"""

      # build the notification HTML
      notificationId = "jquery-notific8-notification-#{num}"
      notification = """
<div class="#{notificationClasses.join(' ')}" id="#{notificationId}">
#{icon}
#{heading}
#{close}
#{message}
</div>
"""

      # add the notification to the stack
      $notification = $(notification)
      $container.append $notification

      # add close functionality
      $close = $notification.find('.jquery-notific8-close')
      $close.on "click", (event) ->
        closeNotification $notification, styles, animate, data
        return

      # call the onCreate handler if it exists
      data.settings.onCreate $notification, data if data.settings.onCreate

      # slide the message onto the screen
      if supports.transition
        setTimeout (->
          $notification.addClass "open"
          unless data.settings.sticky
            ((n, l) ->
              setTimeout (->
                closeNotification n, null, null, data
                return
              ), l
              return
            ) $notification, Number(data.settings.life) + 200
          return
        ), 5
      else
        styles[animate] = 0
        $notification.animate styles,
          duration: "fast"
          complete: ->
            unless data.settings.sticky
              ((n, l) ->
                setTimeout (->
                  closeNotification n, styles, animate, data
                  return
                ), l
                return
              ) $notification, data.settings.life
            data.settings = {}
            return

      return

    ###
    Close the given notification
    @param object n
    @param object styles
    @param boolean animate
    @param object data
    ###
    closeNotification = (n, styles, animate, data) ->
      if supports.transition
        n.removeClass "open"
        n.height 0
        setTimeout (->
          n.remove()
          data.settings.onClose n, data if data.settings.onClose
          return
        ), 200
      else
        styles[animate] = n.outerWidth() * -1
        styles.height = 0
        n.animate styles,
          duration: "fast"
          complete: ->
            n.remove()
            data.settings.onClose n, data if data.settings.onClose
            return

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
