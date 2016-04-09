
/*
@author Will Steinmetz
Notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
var notific8;

notific8 = (function() {
  var buildClose, buildHeading, buildIcon, buildMessage, buildNotification, checkEdges, closeNotification, configure, destroy, getContainer, hasIcon, init, initContainers, notificationClasses, remove, zindex;
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
    namespace: 'notific8',
    height: {
      atomic: 70,
      chicchat: 120,
      legacy: 90
    }
  };

  /*
  Destroy the notification
  @param object options
   */
  destroy = function(options) {
    var body, containerClass, containers;
    containerClass = "" + options.namespace + "-container";
    containers = document.getElementsByClassName(containerClass);
    body = document.getElementsByTagName('body')[0];
    while (containers.length > 0) {
      body.removeChild(containers[0]);
    }
  };

  /*
  Get the container that the notification is inside of
  @params object data
  @return object
   */
  getContainer = function(data) {
    var containerClass, hEdge, namespace, vEdge;
    vEdge = data.settings.verticalEdge;
    hEdge = data.settings.horizontalEdge;
    namespace = data.settings.namespace;
    containerClass = "" + namespace + "-container " + vEdge + " " + hEdge;
    return document.getElementsByClassName(containerClass)[0];
  };

  /*
  Build the notification and add it to the screen's stack
  @param object data
   */
  buildNotification = function(data) {
    var body, container, namespace, notification, notificationId, num;
    body = document.getElementsByTagName('body')[0];
    num = Number(body.dataset.notific8s);
    namespace = data.settings.namespace;
    container = getContainer(data);
    num += 1;
    body.dataset.notific8s = num;
    notificationId = "" + namespace + "-notification-" + num;
    notification = "<div class=\"" + (notificationClasses(data).join(' ')) + "\" id=\"" + notificationId + "\">\n  " + (buildIcon(data)) + "\n  <div class=\"" + data.settings.namespace + "-message-content\">\n    " + (buildHeading(data)) + "\n    " + (buildMessage(data)) + "\n  </div>\n  " + (buildClose(data)) + "\n</div>";
    container.innerHTML += notification;
    setTimeout((function() {
      notification = document.getElementById(notificationId);
      return notification.style.height = "" + data.settings.height + "px";
    }), 1);
    if (data.settings.onCreate) {
      data.settings.onCreate(notification, data);
    }
    setTimeout((function() {
      notification = document.getElementById(notificationId);
      notification.className += " open";
      sessionStorage[notificationId] = JSON.stringify(data);
      if (!data.settings.sticky) {
        (function(n, l) {
          setTimeout((function() {
            closeNotification(notificationId, data);
          }), l);
        })(notification, Number(data.settings.life) + 200);
      }
    }), 5);
  };
  hasIcon = function(data) {
    return (data.settings.icon != null) && (typeof data.settings.icon === "string");
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
    if ((data.settings.heading != null) && (typeof data.settings.heading === "string")) {
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
  @param string notificationId
  @param object data
   */
  closeNotification = function(notificationId, data) {
    var n;
    n = document.getElementById(notificationId);
    if (n == null) {
      return;
    }
    n.className = n.className.replace('open', '');
    n.style.height = 0;
    setTimeout((function() {
      var container;
      container = getContainer(data);
      container.removeChild(n);
      delete sessionStorage[n.id];
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
    var notificationClass, notifications;
    notificationClass = "" + options.namespace + "-notification";
    notifications = document.getElementsByClassName(notificationClass);
    while (notifications.length > 0) {
      notifications[0].parentNode.removeChild(notifications[0]);
    }
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
    var data, key, option;
    data = {
      settings: {},
      message: message
    };
    for (key in notific8Defaults) {
      option = notific8Defaults[key];
      if (key !== 'height') {
        data.settings[key] = option;
      }
    }
    for (key in options) {
      option = options[key];
      data.settings[key] = option;
    }
    if (data.settings.height == null) {
      data.settings.height = notific8Defaults.height[data.settings.family];
    }
    data.settings.height = Number(data.settings.height);
    if (data.settings.height < notific8Defaults.height[data.settings.family]) {
      data.settings.height = notific8Defaults.height[data.settings.family];
    }
    buildNotification(data);
    if (data.settings.onInit) {
      data.settings.onInit(data);
    }
  };

  /*
  Initialize the containers for the plug-in
  @param object options
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
      container.addEventListener("click", function(event) {
        var data, notification, target;
        target = event.target;
        notification = target.parentElement;
        data = JSON.parse(sessionStorage[notification.id]);
        closeNotification(notification.id, data);
      });
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
    if (typeof message !== "string") {
      console.error("notific8 takes a string message as the first parameter");
      throw new Error("notific8 takes a string message as the first parameter");
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
        return destroy(options);
      case "remove":
        return remove(options);
      default:
        containerClass = "" + options.namespace + "-container";
        if (document.getElementsByClassName(containerClass).length === 0) {
          initContainers(options);
        }
        checkEdges(options);
        init(message, options);
    }
  };
})();

//# sourceMappingURL=notific8.js.map
