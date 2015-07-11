
/*
@author Will Steinmetz
jQuery notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2015, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function($) {
  "use strict";
  var methods, self, settings, supports;
  settings = void 0;
  methods = void 0;
  self = void 0;
  supports = void 0;
  settings = {
    life: 10000,
    theme: "teal",
    sticky: false,
    verticalEdge: "right",
    horizontalEdge: "top",
    zindex: 1100,
    icon: false,
    closeText: "close",
    onInit: null,
    onCreate: null,
    onClose: null
  };
  methods = (function() {

    /*
    Destroy the notification
    @param object $this
     */
    var buildNotification, checkEdges, closeNotification, configure, css3Support, destroy, init, initContainers, remove, zindex;
    destroy = function($this) {
      $(window).unbind(".notific8");
      $(".jquery-notific8-container").remove();
    };

    /*
    Build the notification and add it to the screen's stack
    @param object $this
     */
    buildNotification = function($this) {
      var $close, $container, $notification, animate, close, data, hEdge, heading, icon, message, notification, notificationClasses, notificationId, num, styles, vEdge;
      data = $this.data("notific8");
      num = Number($("body").data("notific8s"));
      animate = "margin-" + data.settings.verticalEdge;
      styles = {};
      vEdge = data.settings.verticalEdge;
      hEdge = data.settings.horizontalEdge;
      $container = $(".jquery-notific8-container." + vEdge + "." + hEdge);
      num += 1;
      $("body").data("notific8s", num);
      notificationClasses = ['jquery-notific8-notification', "" + data.settings.theme];
      icon = "";
      if (data.settings.hasOwnProperty("icon") && (typeof data.settings.icon === "string")) {
        notificationClasses.push("has-icon");
        icon = "<i class=\"jquery-notific8-icon notific8-fontastic-" + data.settings.icon + "\"></i>";
      }
      heading = "";
      if (data.settings.hasOwnProperty("heading") && (typeof data.settings.heading === "string")) {
        heading = "<div class=\"jquery-notific8-heading\">\n  " + data.settings.heading + "\n</div>";
      }
      close = '<div class="jquery-notific8-close';
      if (data.settings.sticky) {
        close += ' sticky">';
        close += "" + data.settings.closeText + " <span>&times; </span>";
        notificationClasses.push("sticky");
      } else {
        close += '">&times;';
      }
      close += '</div>';
      message = "<div class=\"jquery-notific8-message\">\n  " + data.message + "\n</div>";
      notificationId = "jquery-notific8-notification-" + num;
      notification = "<div class=\"" + (notificationClasses.join(' ')) + "\" id=\"" + notificationId + "\">\n" + icon + "\n" + heading + "\n" + close + "\n" + message + "\n</div>";
      $notification = $(notification);
      $container.append($notification);
      $close = $notification.find('.jquery-notific8-close');
      $close.on("click", function(event) {
        closeNotification($notification, styles, animate, data);
      });
      if (data.settings.onCreate) {
        data.settings.onCreate($notification, data);
      }
      if (supports.transition) {
        setTimeout((function() {
          $notification.addClass("open");
          if (!data.settings.sticky) {
            (function(n, l) {
              setTimeout((function() {
                closeNotification(n, null, null, data);
              }), l);
            })($notification, Number(data.settings.life) + 200);
          }
        }), 5);
      } else {
        styles[animate] = 0;
        $notification.animate(styles, {
          duration: "fast",
          complete: function() {
            if (!data.settings.sticky) {
              (function(n, l) {
                setTimeout((function() {
                  closeNotification(n, styles, animate, data);
                }), l);
              })($notification, data.settings.life);
            }
            data.settings = {};
          }
        });
      }
    };

    /*
    Close the given notification
    @param object n
    @param object styles
    @param boolean animate
    @param object data
     */
    closeNotification = function(n, styles, animate, data) {
      if (supports.transition) {
        n.removeClass("open");
        n.height(0);
        setTimeout((function() {
          n.remove();
          if (data.settings.onClose) {
            data.settings.onClose(n, data);
          }
        }), 200);
      } else {
        styles[animate] = n.outerWidth() * -1;
        styles.height = 0;
        n.animate(styles, {
          duration: "fast",
          complete: function() {
            n.remove();
            if (data.settings.onClose) {
              data.settings.onClose(n, data);
            }
          }
        });
      }
    };

    /*
    Set up the configuration settings
    @param object options
     */
    configure = function(options) {
      $.extend(settings, options);
    };

    /*
    Remove the currently visible notifications from the screen
     */
    remove = function() {
      $(".jquery-notific8-notification").remove();
    };

    /*
    Set up the z-index
    @param int z
     */
    zindex = function(z) {
      settings.zindex = z;
    };

    /*
    Initialize the plug-in
    @param string message
    @param object options
    @return object
     */
    init = function(message, options) {
      return self.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data("notific8");
        $this.data("notific8", {
          target: $this,
          settings: {},
          message: ""
        });
        data = $this.data("notific8");
        data.message = message;
        $.extend(data.settings, settings, options);
        buildNotification($this);
        if (data.settings.onInit) {
          data.settings.onInit(data);
        }
      });
    };

    /*
    Initialize the containers for the plug-in
     */
    initContainers = function() {
      var $body, containerStr;
      $body = $("body");
      $body.data("notific8s", 0);
      containerStr = '<div class="jquery-notific8-container $pos"></div>';
      $body.append(containerStr.replace('$pos', 'top right'));
      $body.append(containerStr.replace('$pos', 'top left'));
      $body.append(containerStr.replace('$pos', 'bottom right'));
      $body.append(containerStr.replace('$pos', 'bottom left'));
      $('.jquery-notific8-container').css("z-index", settings.zindex);
    };

    /*
    Make sure that the edge options are ok
    @param object options
     */
    checkEdges = function(options) {
      options.verticalEdge = (options.verticalEdge || settings.verticalEdge).toLowerCase();
      options.horizontalEdge = (options.horizontalEdge || settings.horizontalEdge).toLowerCase();
      if ((options.verticalEdge !== "right") && (options.verticalEdge !== "left")) {
        options.verticalEdge = settings.verticalEdge;
      }
      if ((options.horizontalEdge !== "top") && (options.horizontalEdge !== "bottom")) {
        options.horizontalEdge = settings.horizontalEdge;
      }
    };

    /*
    Determine support for CSS3 property
    @param string prop
     */
    css3Support = function(prop) {
      var capitalize, i, len, p, pNoPrefix, pStr, s;
      p = prop.split("-");
      pStr = "";
      i = void 0;
      len = void 0;
      s = document.createElement("p").style;
      capitalize = void 0;
      pNoPrefix = void 0;
      capitalize = function(l) {
        return l.charAt(0).toUpperCase() + l.slice(1);
      };
      i = 0;
      len = p.length;
      while (i < len) {
        pStr = pStr + p[i].toLowerCase().replace(/\b\w{3,}/g, capitalize);
        i = i + 1;
      }
      pNoPrefix = pStr.charAt(0).toLowerCase() + pStr.slice(1);
      supports[prop] = s.hasOwnProperty(pNoPrefix) || s.hasOwnProperty("Webkit" + pStr) || s.hasOwnProperty("Moz" + pStr) || s.hasOwnProperty("ms" + pStr) || s.hasOwnProperty("O" + pStr);
    };
    return {
      init: init,
      destroy: destroy,
      configure: configure,
      zindex: zindex,
      initContainers: initContainers,
      checkEdges: checkEdges,
      css3Support: css3Support,
      remove: remove
    };
  })();

  /*
  wrapper since this plug-in is called without selecting an element first
  @param string message
  @param object options
   */
  $.notific8 = function(message, options) {
    var hEdge, vEdge;
    switch (message) {
      case "configure":
      case "config":
        return methods.configure.apply(this, [options]);
      case "zindex":
        return methods.zindex.apply(this, [options]);
      case "destroy":
        return methods.destroy.apply(this, [options]);
      case "remove":
        return methods.remove.apply(this, [options]);
      default:
        if (typeof options === "undefined") {
          options = {};
        }
        if ($(".jquery-notific8-container").size() === 0) {
          methods.initContainers();
        }
        methods.checkEdges(options);
        vEdge = options.verticalEdge;
        hEdge = options.horizontalEdge;
        return $(".jquery-notific8-container." + vEdge + "." + hEdge).notific8(message, options);
    }
  };

  /*
  plugin setup
   */
  $.fn.notific8 = function(message, options) {
    self = this;
    if (typeof supports === "undefined") {
      supports = {};
      methods.css3Support("transition");
    }
    if (typeof message === "string") {
      methods.init.apply(this, arguments);
    } else {
      $.error("jQuery.notific8 takes a string message as the first parameter");
    }
  };
})(jQuery);

//# sourceMappingURL=jquery.notific8.js.map
