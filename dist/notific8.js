
/*
@author Will Steinmetz
notific8 Javascript plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
var notific8;

notific8 = (function() {
  var buildClose, buildHeading, buildMessage, buildNotification, checkEdges, checkThemeOptions, closeNotification, configure, destroy, errorMessage, getContainer, init, initContainers, notificationClasses, registerModule, remove, zindex;
  window.notific8Defaults = {
    life: 10000,
    theme: 'legacy',
    color: 'teal',
    sticky: false,
    verticalEdge: 'right',
    horizontalEdge: 'top',
    zindex: 1100,
    closeText: 'close',
    onInit: null,
    onCreate: null,
    onClose: null,
    namespace: 'notific8',
    height: {
      atomic: 70,
      chicchat: 120,
      legacy: 90,
      materlialish: 48
    }
  };
  window.notific8RegisteredModules = {
    beforeContent: [],
    afterContent: []
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
    var containerClass, horizontalEdge, namespace, verticalEdge, _ref;
    _ref = data.settings, verticalEdge = _ref.verticalEdge, horizontalEdge = _ref.horizontalEdge, namespace = _ref.namespace;
    containerClass = "" + namespace + "-container " + verticalEdge + " " + horizontalEdge;
    return document.getElementsByClassName(containerClass)[0];
  };

  /*
  Build the notification and add it to the screen's stack
  @param object data
   */
  buildNotification = function(data) {
    var body, container, generatedNotificationClasses, module, moduleResults, namespace, notification, notificationId, num, _i, _j, _len, _len1, _ref, _ref1;
    body = document.getElementsByTagName('body')[0];
    num = Number(body.dataset.notific8s);
    namespace = data.settings.namespace;
    container = getContainer(data);
    num += 1;
    body.dataset.notific8s = num;
    notificationId = "" + namespace + "-notification-" + num;
    generatedNotificationClasses = notificationClasses(data);
    notification = "<div class=\"$notificationClasses\" id=\"" + notificationId + "\">";
    _ref = notific8RegisteredModules.beforeContent;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      moduleResults = module.callbackMethod(data);
      generatedNotificationClasses = generatedNotificationClasses.concat(moduleResults.classes);
      notification += moduleResults.html;
    }
    notification += "<div class=\"" + data.settings.namespace + "-message-content\">\n  " + (buildHeading(data)) + "\n  " + (buildMessage(data)) + "\n</div>";
    _ref1 = notific8RegisteredModules.afterContent;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      module = _ref1[_j];
      moduleResults = module.callbackMethod(data);
      generatedNotificationClasses = generatedNotificationClasses.concat(moduleResults.classes);
      notification += moduleResults.html;
    }
    notification += "" + (buildClose(data)) + "\n</div>";
    notification = notification.replace('$notificationClasses', generatedNotificationClasses.join(' '));
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
  buildMessage = function(data) {
    return "<div class=\"" + data.settings.namespace + "-message\">\n" + data.message + "\n</div>";
  };
  notificationClasses = function(data) {
    var classes;
    classes = ["" + data.settings.namespace + "-notification", "family-" + data.settings.theme, data.settings.color];
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
  @param object options
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
      data.settings.height = notific8Defaults.height[data.settings.theme];
    }
    data.settings.height = Number(data.settings.height);
    if (data.settings.height < notific8Defaults.height[data.settings.theme]) {
      data.settings.height = notific8Defaults.height[data.settings.theme];
    }
    checkThemeOptions(data);
    buildNotification(data);
    if (data.settings.onInit) {
      data.settings.onInit(data);
    }
  };

  /*
  @TODO remove
  Check that the theme, color, and family options are set appropriately.
  This method will be removed for version 4.0 when the family option is removed
  and backwards compatibility will be removed.
  @param object data
   */
  checkThemeOptions = function(data) {
    var validThemes;
    validThemes = ['legacy', 'atomic', 'chicchat', 'materialish'];
    if (!(validThemes.indexOf(data.settings.theme) > -1)) {
      data.settings.color = data.settings.theme;
      data.settings.theme = data.settings.family;
      if ((typeof console !== "undefined" && console !== null) && (console.warn != null)) {
        return console.warn("The option 'theme' now references the value that was formerly used for 'family'. The option 'color' was added in version 3.2.0 to replace the former functionality of the 'theme' option. The 'family' option and backwards compatibility will be removed in version 4.0. Please update the options configuration in your code as soon as possible.");
      }
    }
  };

  /*
  Initialize the containers for the plug-in
  @param object options
   */
  initContainers = function(options) {
    var body, container, containerClass, containerStr, position, _i, _j, _len, _len1, _ref, _ref1;
    body = document.getElementsByTagName('body')[0];
    body.dataset.notific8s = 0;
    containerClass = "" + options.namespace + "-container";
    containerStr = "<div class='" + containerClass + " $pos'></div>";
    _ref = ['top right', 'top left', 'bottom right', 'bottom left'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      position = _ref[_i];
      body.innerHTML += containerStr.replace('$pos', position);
    }
    _ref1 = document.getElementsByClassName(containerClass);
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      container = _ref1[_j];
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

  /*
  Register a module for use in the system
  @param string moduleName
  @param string position
  @param object defaultOptions
  @param function callbackMethod
   */
  registerModule = function(moduleName, position, defaultOptions, callbackMethod) {
    var defaultValue, module, option, _i, _len, _ref;
    if (!(typeof moduleName === 'string' && moduleName.trim() !== '')) {
      errorMessage("moduleName should be a string");
    }
    if (!(typeof position === 'string' && (position === 'beforeContent' || position === 'afterContent'))) {
      errorMessage("position should be a string");
    }
    if (typeof defaultOptions !== 'object') {
      errorMessage("defaultOptions should be an object");
    }
    if (typeof callbackMethod !== 'function') {
      errorMessage("callbackMethod should be an function");
    }
    _ref = notific8RegisteredModules[position];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      if (module.moduleName === moduleName) {
        errorMessage("Module '" + moduleName + "' has already been registered");
      }
    }
    for (option in defaultOptions) {
      defaultValue = defaultOptions[option];
      notific8Defaults[option] = defaultValue;
    }
    return notific8RegisteredModules[position].push({
      moduleName: moduleName,
      callbackMethod: callbackMethod
    });
  };

  /*
  Displays an error message to the console and throws an error
  @param string message
   */
  errorMessage = function(message) {
    console.error(message);
    throw new Error(message);
  };
  return function(message, options) {
    var callbackMethod, containerClass, defaultOptions, moduleName, position;
    if (typeof message !== "string") {
      errorMessage("notific8 takes a string message as the first parameter");
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
      case "registerModule":
        if (arguments.length !== 5) {
          errorMessage("Registering a module requires the parameters moduleName, position, defaultOptions, and callbackMethod.");
        }
        message = arguments[0], moduleName = arguments[1], position = arguments[2], defaultOptions = arguments[3], callbackMethod = arguments[4];
        return registerModule(moduleName, position, defaultOptions, callbackMethod);
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
