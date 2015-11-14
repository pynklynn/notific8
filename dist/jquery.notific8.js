
/*
@author Will Steinmetz
jQuery notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2015, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function($) {
  "use strict";
  var methods, self, settings;
  self = void 0;
  settings = {
    life: 10000,
    family: 'legacy',
    theme: "teal",
    sticky: false,
    verticalEdge: "right",
    horizontalEdge: "top",
    zindex: 1100,
    icon: false,
    closeText: "close",
    onInit: null,
    onCreate: null,
    onClose: null,
    namespace: 'notific8'
  };
  methods = (function() {

    /*
    Destroy the notification
    @param object options
     */
    var buildClose, buildHeading, buildIcon, buildMessage, buildNotification, checkEdges, closeNotification, configure, destroy, hasIcon, init, initContainers, notificationClasses, remove, zindex;
    destroy = function(options) {
      $(window).unbind(".notific8");
      $("." + options.namespace + "-container").remove();
    };

    /*
    Build the notification and add it to the screen's stack
    @param object $this
     */
    buildNotification = function($this) {
      var $container, $notification, animate, data, hEdge, notification, notificationId, num, vEdge;
      data = $this.data("notific8");
      num = Number($("body").data("notific8s"));
      animate = "margin-" + data.settings.verticalEdge;
      vEdge = data.settings.verticalEdge;
      hEdge = data.settings.horizontalEdge;
      $container = $("." + data.settings.namespace + "-container." + vEdge + "." + hEdge);
      num += 1;
      $("body").data("notific8s", num);
      notificationId = "" + data.settings.namespace + "-notification-" + num;
      notification = "<div class=\"" + (notificationClasses(data).join(' ')) + "\" id=\"" + notificationId + "\">\n" + (buildIcon(data)) + "\n" + (buildHeading(data)) + "\n" + (buildClose(data)) + "\n" + (buildMessage(data)) + "\n</div>";
      $notification = $(notification);
      $container.append($notification);
      if (data.settings.onCreate) {
        data.settings.onCreate($notification, data);
      }
      setTimeout((function() {
        $notification.addClass("open");
        if (!data.settings.sticky) {
          (function(n, l) {
            setTimeout((function() {
              closeNotification(n, data);
            }), l);
          })($notification, Number(data.settings.life) + 200);
        }
      }), 5);
    };
    hasIcon = function(data) {
      return data.settings.hasOwnProperty("icon") && (typeof data.settings.icon === "string");
    };
    buildClose = function(data) {
      var close;
      close = "<div class=\"" + data.settings.namespace + "-close";
      if (data.settings.sticky) {
        close += ' sticky">';
        close += "" + data.settings.closeText;
      } else {
        close += '">&times;';
      }
      close += '</div>';
      return close;
    };
    buildHeading = function(data) {
      if (data.settings.hasOwnProperty("heading") && (typeof data.settings.heading === "string")) {
        return "<div class=\"" + data.settings.namespace + "-heading\">\n  " + data.settings.heading + "\n</div>";
      } else {
        return "";
      }
    };
    buildIcon = function(data) {
      var classes;
      if (hasIcon(data)) {
        classes = ["" + data.settings.namespace + "-icon", "" + data.settings.namespace + "-fontastic-" + data.settings.icon];
        return "<i class=\"" + (classes.join(' ')) + "\"></i>";
      } else {
        return "";
      }
    };
    buildMessage = function(data) {
      return "<div class=\"" + data.settings.namespace + "-message\">\n  " + data.message + "\n</div>";
    };
    notificationClasses = function(data) {
      var classes;
      classes = ["" + data.settings.namespace + "-notification", "family-" + data.settings.family, data.settings.theme];
      if (hasIcon(data)) {
        classes.push("has-icon");
      }
      if (data.settings.sticky) {
        classes.push("sticky");
      }
      return classes;
    };

    /*
    Close the given notification
    @param object n
    @param object data
     */
    closeNotification = function(n, data) {
      n.removeClass("open");
      n.height(0);
      setTimeout((function() {
        n.remove();
        if (data.settings.onClose) {
          data.settings.onClose(n, data);
        }
      }), 200);
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
    remove = function(options) {
      $("." + options.namespace + "-notification").remove();
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
    initContainers = function(options) {
      var $body, containerClass, containerStr;
      $body = $("body");
      $body.data("notific8s", 0);
      containerClass = "" + options.namespace + "-container";
      containerStr = "<div class='" + containerClass + " $pos'></div>";
      $body.append(containerStr.replace('$pos', 'top right'));
      $body.append(containerStr.replace('$pos', 'top left'));
      $body.append(containerStr.replace('$pos', 'bottom right'));
      $body.append(containerStr.replace('$pos', 'bottom left'));
      $("." + containerClass).css("z-index", settings.zindex);
      $("." + containerClass).on('click', "." + options.namespace + "-close", function(e) {
        var $container, $notification, $target, data;
        $target = $(e.currentTarget);
        $notification = $target.closest("." + options.namespace + "-notification");
        $container = $notification.closest("." + containerClass);
        data = $container.data('notific8');
        closeNotification($notification, data);
      });
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
    return {
      init: init,
      destroy: destroy,
      configure: configure,
      zindex: zindex,
      initContainers: initContainers,
      checkEdges: checkEdges,
      remove: remove
    };
  })();

  /*
  wrapper since this plug-in is called without selecting an element first
  @param string message
  @param object options
   */
  $.notific8 = function(message, options) {
    var containerClass, hEdge, vEdge;
    if (options == null) {
      options = {};
    }
    if (!(options.hasOwnProperty('namespace') || message === 'zindex')) {
      options.namespace = 'notific8';
    }
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
        containerClass = "" + options.namespace + "-container";
        if ($("." + containerClass).size() === 0) {
          methods.initContainers(options);
        }
        methods.checkEdges(options);
        vEdge = options.verticalEdge;
        hEdge = options.horizontalEdge;
        return $("." + containerClass + "." + vEdge + "." + hEdge).notific8(message, options);
    }
  };

  /*
  plugin setup
   */
  $.fn.notific8 = function(message, options) {
    self = this;
    if (typeof message === "string") {
      methods.init.apply(this, arguments);
    } else {
      $.error("jQuery.notific8 takes a string message as the first parameter");
    }
  };
})(jQuery);

//# sourceMappingURL=jquery.notific8.js.map
