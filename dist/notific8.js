
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
    onInit: [],
    onCreate: [],
    onClose: [],
    namespace: 'notific8',
    queue: false,
    height: {
      atomic: 70,
      chicchat: 120,
      legacy: 90,
      materialish: 48
    }
  };
  window.notific8RegisteredModules = {
    beforeContent: [],
    afterContent: [],
    beforeContainer: [],
    afterContainer: [],
    insideContainer: []
  };
  window.notific8Queue = [];
  window.notific8DataStore = {};
  window.notific8ContainerHandlers = {
    onContainerCreate: []
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
    containerClass = "." + namespace + "-container." + verticalEdge + "." + horizontalEdge;
    return document.querySelector(containerClass);
  };

  /*
  Build the notification and add it to the screen's stack
  @param object data
   */
  buildNotification = function(data) {
    var body, container, generatedNotificationClasses, module, moduleResults, namespace, notification, notificationId, num, onCreate, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
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
    if (data.settings.onCreate.length) {
      _ref2 = data.settings.onCreate;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        onCreate = _ref2[_k];
        onCreate(notification, data);
      }
    }
    setTimeout((function() {
      notification = document.getElementById(notificationId);
      notification.className += " open";
      notific8DataStore[notificationId] = data;
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
      var container, next, onClose, _i, _len, _ref;
      container = getContainer(data);
      console.log(notificationId);
      console.log(container);
      console.log(n);
      container.removeChild(n);
      delete notific8DataStore[n.id];
      if (data.settings.onClose.length) {
        _ref = data.settings.onClose;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          onClose = _ref[_i];
          onClose(n, data);
        }
      }
      if (notific8Defaults.queue && notific8Queue.length) {
        next = notific8Queue.shift();
        notific8(next.message, next.options);
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
      if (['onInit', 'onCreate', 'onClose'].indexOf(key) > -1) {
        if (typeof option === 'function') {
          notific8Defaults[key].push(option);
        } else {
          notific8Defaults[key] = notific8Defaults[key].concat(option);
        }
      } else if (key === 'onContainerCreate') {
        if (typeof option === 'function') {
          notific8ContainerHandlers.onContainerCreate.push(option);
        } else {
          notific8ContainerHandlers.onContainerCreate = notific8ContainerHandlers.onContainerCreate.concat(option);
        }
      } else {
        notific8Defaults[key] = option;
      }
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
    var arrayKeys, data, handler, key, onInit, option, prop, propertiesToRemove, _i, _j, _k, _len, _len1, _len2, _ref;
    data = {
      settings: {},
      message: message
    };
    arrayKeys = ['onInit', 'onCreate', 'onClose'];
    for (key in notific8Defaults) {
      option = notific8Defaults[key];
      if (key !== 'height') {
        data.settings[key] = option;
      }
    }
    for (key in options) {
      option = options[key];
      if (arrayKeys.indexOf(key) > -1) {
        if (typeof option === 'function') {
          option = [option];
        }
        for (_i = 0, _len = option.length; _i < _len; _i++) {
          handler = option[_i];
          data.settings[key].push(handler);
        }
      } else {
        data.settings[key] = option;
      }
    }
    propertiesToRemove = ['onContainerCreate', 'queue'];
    for (_j = 0, _len1 = propertiesToRemove.length; _j < _len1; _j++) {
      prop = propertiesToRemove[_j];
      delete data.settings[prop];
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
    if (data.settings.onInit.length) {
      _ref = data.settings.onInit;
      for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
        onInit = _ref[_k];
        onInit(data);
      }
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
    var body, container, containerClasses, containerStr, handler, module, moduleResults, position, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    body = document.getElementsByTagName('body')[0];
    body.dataset.notific8s = 0;
    containerClasses = ["" + options.namespace + "-container"];
    containerStr = "";
    _ref = notific8RegisteredModules.beforeContainer;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      module = _ref[_i];
      moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }
    containerStr += "<div class=\"$classes $pos\">";
    _ref1 = notific8RegisteredModules.insideContainer;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      module = _ref1[_j];
      moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }
    containerStr += "</div>";
    _ref2 = notific8RegisteredModules.afterContainer;
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      module = _ref2[_k];
      moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }
    _ref3 = ['top right', 'top left', 'bottom right', 'bottom left'];
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      position = _ref3[_l];
      body.innerHTML += containerStr.replace('$pos', position).replace('$classes', containerClasses.join(' '));
    }
    _ref4 = document.getElementsByClassName(containerClasses[0]);
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      container = _ref4[_m];
      container.style.zIndex = notific8Defaults.zindex;
      _ref5 = notific8ContainerHandlers.onContainerCreate;
      for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
        handler = _ref5[_n];
        handler(container, options);
      }
      container.addEventListener("click", function(event) {
        var data, notification, notificationClass, target;
        target = event.target;
        notification = target.parentElement;
        notificationClass = "" + options.namespace + "-notification";
        if (notification.className.split(' ').indexOf(notificationClass) === -1) {
          return;
        }
        data = notific8DataStore[notification.id];
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
    var defaultValue, module, option, validPositions, _i, _len, _ref;
    if (!(typeof moduleName === 'string' && moduleName.trim() !== '')) {
      errorMessage("moduleName should be a string");
    }
    validPositions = ['beforeContent', 'afterContent', 'beforeContainer', 'afterContainer', 'insideContainer'];
    if (!(typeof position === 'string' && validPositions.indexOf(position) > -1)) {
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
    var callbackMethod, containerClass, defaultOptions, moduleName, notificationClass, num, position;
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
        notificationClass = "" + options.namespace + "-notification";
        num = document.getElementsByClassName(notificationClass).length;
        if (!notific8Defaults.queue || num === 0) {
          init(message, options);
        } else {
          notific8Queue.push({
            message: message,
            options: options
          });
        }
    }
  };
})();

//# sourceMappingURL=notific8.js.map
