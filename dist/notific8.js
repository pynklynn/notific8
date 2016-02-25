
/*
@author Will Steinmetz
Notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
var notific8;

notific8 = (function() {
  var buildClose, buildHeading, buildIcon, buildMessage, buildNotification, checkEdges, closeNotification, configure, destroy, hasIcon, init, initContainers, notificationClasses, remove, zindex;
  window.notific8Defaults = {
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

  /*
  Destroy the notification
  @param object options
   */
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
      return "<div class=\"" + data.settings.namespace + "-heading\">\n" + data.settings.heading + "\n</div>";
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
    return "<div class=\"" + data.settings.namespace + "-message\">\n" + data.message + "\n</div>";
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
    var key, option;
    for (key in options) {
      option = options[key];
      notific8Defaults[key] = option;
    }
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
    notific8Defaults.zindex = z;
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
    var body, container, containerClass, containerStr, parser, _i, _len, _ref;
    body = document.getElementsByTagName('body')[0];
    body.dataset.notific8s = 0;
    containerClass = "" + options.namespace + "-container";
    containerStr = "<div class='" + containerClass + " $pos'></div>";
    parser = new DOMParser();
    body.innerHTML += containerStr.replace('$pos', 'top right');
    body.innerHTML += containerStr.replace('$pos', 'top left');
    body.innerHTML += containerStr.replace('$pos', 'bottom right');
    body.innerHTML += containerStr.replace('$pos', 'bottom left');
    _ref = document.getElementsByClassName(containerClass);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      container = _ref[_i];
      container.style.zIndex = notific8Defaults.zindex;
      container.onclick = function(event) {
        var target;
        target = event.target;
      };
    }
  };

  /*
  Make sure that the edge options are ok
  @param object options
   */
  checkEdges = function(options) {
    options.verticalEdge = (options.verticalEdge || notific8Defaults.verticalEdge).toLowerCase();
    options.horizontalEdge = (options.horizontalEdge || notific8Defaults.horizontalEdge).toLowerCase();
    if ((options.verticalEdge !== "right") && (options.verticalEdge !== "left")) {
      options.verticalEdge = notific8Defaults.verticalEdge;
    }
    if ((options.horizontalEdge !== "top") && (options.horizontalEdge !== "bottom")) {
      options.horizontalEdge = notific8Defaults.horizontalEdge;
    }
  };
  return function(message, options) {
    var containerClass;
    console.log("message: ", message);
    console.log("options: ", options);
    if (typeof message !== "string") {
      console.error("jQuery.notific8 takes a string message as the first parameter");
    }
    if (options == null) {
      options = {};
    }
    if (!(options.hasOwnProperty('namespace') || message === 'zindex')) {
      options.namespace = 'notific8';
    }
    switch (message) {
      case "configure":
      case "config":
        return configure(options);
      case "zindex":
        return zindex(options);
      case "destroy":
        return methods.destroy.apply(this, [options]);
      case "remove":
        return methods.remove.apply(this, [options]);
      default:
        containerClass = "" + options.namespace + "-container";
        if (document.getElementsByClassName(containerClass).length === 0) {
          initContainers(options);
        }
        return checkEdges(options);
    }
  };
})();

//# sourceMappingURL=notific8.js.map
