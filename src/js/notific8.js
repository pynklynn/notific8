/**
 * @author Will Steinmetz
 * notific8 Javascript plug-in
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
var notific8;

notific8 = (function() {
  window.notific8Defaults = {
    life: 10000,
    theme: 'ocho',
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
    queue: false
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

  /**
   * Destroy the notification
   * @param {Object} options object defining the settings of the notification
   */
  function destroy(options) {
    let containerClass = options.namespace + "-container",
      containers = document.getElementsByClassName(containerClass),
      body = document.getElementsByTagName('body')[0];

    while (containers.length > 0) {
      body.removeChild(containers[0]);
    }
  }

  /**
   * Get the container that the notification is inside of
   * @params {Object} data object defining the settings of the notification
   * @return {Object}      html DOM object for the container
   */
  function getContainer(data) {
    let { verticalEdge, horizontalEdge, namespace } = data.settings,
      containerClass = `.${namespace}-container.${verticalEdge}.${horizontalEdge}`;

    return document.querySelector(containerClass);
  }

  /**
   * Build the notification close HTML
   * @param  {Object} data object defining the settings of the notification
   * @return {String}      HTML for rendering the close button of the notification
   */
  function buildClose(data) {
    let closeClasses = [ `${data.settings.namespace}-close` ],
      closeText = '&times;';

    if (data.settings.sticky) {
      closeClasses.push('sticky');
      closeText = data.settings.closeText;
    }

    return `<button type="button" class="${closeClasses.join(' ')}" aria-label="dismiss notification">${closeText}</button>`;
  }

  /**
   * Build the HTML for the heading if it is there
   * @param  {Object} data object defining the settings of the notification
   * @return {String}      HTML for the heading part of the notification
   */
  function buildHeading(data) {
    if (
      (data.settings.heading !== null) &&
      (typeof data.settings.heading === "string")
    ) {
      return `<header class="${data.settings.namespace}-heading">${data.settings.heading}</header>`;
    } else {
      return "";
    }
  }

  /**
   * Build the message HTML for the notification
   * @param  {Object} data object defining the settings of the notification
   * @return {String}      HTML for the message part of the notification
   */
  function buildMessage(data) {
    return `<div class="${data.settings.namespace}-message">${data.message}</div>`;
  }

  /**
   * Build the list of notification classes to apply
   * @param  {Object} data object defining the settings of the notification
   * @return {Array}       array of classes to assign to the notification
   */
  function notificationClasses(data) {
    let classes;

    // @TODO remove for 5.0.0 - deprecated
    if (data.settings.theme.toLowerCase() === 'legacy') {
      data.settings.theme = 'ocho';
    }
    classes = [
      `${data.settings.namespace}-notification`,
      `family-${data.settings.theme}`,
      data.settings.theme,
      data.settings.color
    ];
    if (data.settings.sticky) {
      classes.push("sticky");
    }
    if (
      (data.settings.heading !== null) &&
      (typeof data.settings.heading === "string")
    ) {
      classes.push("has-heading");
    }
    return classes;
  }

  /**
   * Build the notification and add it to the screen's stack
   * @param {Object} data object defining the data for building the notification
   */
  function buildNotification(data) {
    var body = document.getElementsByTagName('body')[0],
      container = getContainer(data),
      generatedNotificationClasses = notificationClasses(data),
      namespace = data.settings.namespace,
      num = Number(body.dataset.notific8s) + 1,
      notificationId = data.settings.id ? data.settings.id.replace(/\s/g, '-') : `${namespace}-notification-${num}`,
      notification = `<article class="$notificationClasses" id="${notificationId}" data-name="${data.settings.notificationName}" role="status" aria-live="polite">`,
      beforeContentModules = notific8RegisteredModules.beforeContent,
      afterContentModules = notific8RegisteredModules.afterContent,
      onCreateHandlers = data.settings.onCreate;

    body.dataset.notific8s = num;
    for (let i = 0, len = beforeContentModules.length; i < len; i++) {
      let module = beforeContentModules[i],
        moduleResults = module.callbackMethod(data);
      generatedNotificationClasses = generatedNotificationClasses.concat(moduleResults.classes);
      notification += moduleResults.html;
    }

    notification += `<div class="${data.settings.namespace}-message-content">${buildHeading(data)} ${buildMessage(data)}</div>`;
    for (let j = 0, len = afterContentModules.length; j < len; j++) {
      let module = afterContentModules[j],
        moduleResults = module.callbackMethod(data);
      generatedNotificationClasses = generatedNotificationClasses.concat(moduleResults.classes);
      notification += moduleResults.html;
    }

    notification += `${buildClose(data)}</article>`;
    notification = notification.replace('$notificationClasses', generatedNotificationClasses.join(' '));
    container.innerHTML += notification;

    for (let k = 0, len = onCreateHandlers.length; k < len; k++) {
      let onCreate = onCreateHandlers[k];
      onCreate(notification, data);
    }

    setTimeout(function() {
      let notification = document.getElementById(notificationId);

      // need to make sure the notification still exists in case of a race
      // condition due to calling the remove method several times
      if (!notification) {
        return;
      }

      notification.className += " open";
      notific8DataStore[notificationId] = data;
      if (!data.settings.sticky) {
        (function(n, l) {
          setTimeout(function() {
            closeNotification(notificationId, data);
          }, l);
        })(notification, Number(data.settings.life) + 200);
      }
    }, 5);
  };

  /**
   * Close the given notification
   * @param {String} notificationId notification ID to look for
   * @param {Object} data           object defining the data for building the notification
   */
  function closeNotification(notificationId, data) {
    let n = document.getElementById(notificationId);

    // if something happened to cause the notifcation to be removed from the
    // screen before this method is called (such as with remove), we need to
    // return so that there isn't an error in the console
    if (n === null) {
      return;
    }

    n.className = n.className.replace('open', '');

    // it's possible this method may be called in quick succession so we need
    // to isolate scope to this notification
    (function(notification, notificationId) {
      let container = getContainer(data),
        next,
        onClose,
        onCloseCallbacks;

      setTimeout(function() {
        container.removeChild(notification);
        delete notific8DataStore[notificationId];

        if (data.settings.onClose.length) {
          onCloseCallbacks = data.settings.onClose;
          for (let i = 0, len = onCloseCallbacks.length; i < len; i++) {
            onClose = onCloseCallbacks[i];
            onClose(notification, data);
          }
        }

        // call the next notification in the queue
        if (notific8Defaults.queue && notific8Queue.length) {
          next = notific8Queue.shift();
          notific8(next.message, next.options);
        }
      }, 200);
    })(n, notificationId);
  }

  /**
   * Set up the configuration settings
   * @param {Object} options object containing the options to configure as the defaults
   */
  function configure(options) {
    let key, option;

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
  }

  /**
   * Remove the currently visible notifications from the screen
   * @param {Object} options object containing the options that build the notifications
   */
  function remove(options) {
    let notificationClass = `${options.namespace}-notification`,
      notifications = document.getElementsByClassName(notificationClass);

    while (notifications.length > 0) {
      notifications[0].parentNode.removeChild(notifications[0]);
    }
  }

  /**
   * Remove the given notification names from the queue
   * @param {Mixed} notificationNames list of notifications
   */
  function removeFromQueue(notificationNames) {
    let key, notification;

    if (typeof notificationNames !== "object") {
      notificationNames = [notificationNames];
    }

    for (let i = 0, len = notificationNames.length; i < len; i++) {
      notification = notificationNames[i];
      for (key in notific8Queue) {
        if (notific8Queue[key].options.notificationName === notification) {
          notific8Queue.splice(key, 1);
          break;
        }
      }
    }
  }

  /**
   * Set up the z-index
   * @param {Integer} z the z-index to set as the default
   */
  function zindex(z) {
    notific8Defaults.zindex = z;
  }

  /**
   * Initialize the plug-in
   * @param {String} message string representing the message for the notification
   * @param {Object} options options to build the notification with
   */
  function init(message, options) {
    let arrayKeys = ['onInit', 'onCreate', 'onClose'],
      data = {
        settings: {},
        message: message
      },
      key,
      onInit,
      option,
      propertiesToRemove,
      onInitHandlers;

    for (key in notific8Defaults) {
      option = notific8Defaults[key];
      data.settings[key] = option;
    }
    for (key in options) {
      option = options[key];
      if (arrayKeys.indexOf(key) > -1) {
        if (typeof option === 'function') {
          option = [option];
        }
        for (let i = 0, len = option.length; i < len; i++) {
          data.settings[key].push(option[i]);
        }
      } else {
        data.settings[key] = option;
      }
    }

    propertiesToRemove = ['onContainerCreate', 'queue'];
    for (let j = 0, len = propertiesToRemove.length; j < len; j++) {
      delete data.settings[propertiesToRemove[j]];
    }

    buildNotification(data);
    if (data.settings.onInit.length) {
      onInitHandlers = data.settings.onInit;
      for (let k = 0, len = onInitHandlers.length; k < len; k++) {
        onInit = onInitHandlers[k];
        onInit(data);
      }
    }
  }

  /**
   * Initialize the containers for the plug-in
   * @param {Object} options to associate with the notification containers
   */
  function initContainers(options) {
    var body = document.getElementsByTagName('body')[0],
      containerClasses = [`${options.namespace}-container`],
      containerStr = "",
      beforeContainerModules,
      insideContainerModules,
      afterContainerModules,
      containerPositions,
      containers,
      onContainerCreateHandlers;

    body.dataset.notific8s = 0;

    beforeContainerModules = notific8RegisteredModules.beforeContainer;
    for (let i = 0, len = beforeContainerModules.length; i < len; i++) {
      let module = beforeContainerModules[i],
        moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }

    containerStr += '<div class="$classes $pos">';
    insideContainerModules = notific8RegisteredModules.insideContainer;
    for (let j = 0, len = insideContainerModules.length; j < len; j++) {
      let module = insideContainerModules[j],
        moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }
    containerStr += '</div>';

    afterContainerModules = notific8RegisteredModules.afterContainer;
    for (let k = 0, len = afterContainerModules.length; k < len; k++) {
      let module = afterContainerModules[k],
        moduleResults = module.callbackMethod(notific8Defaults);
      containerClasses = containerClasses.concat(moduleResults.classes);
      containerStr += moduleResults.html;
    }

    containerPositions = ['top right', 'top left', 'bottom right', 'bottom left'];
    for (let m = 0, len = containerPositions.length; m < len; m++) {
      let position = containerPositions[m],
        modifiedContainerStr = containerStr.replace('$pos', position).replace('$classes', containerClasses.join(' ')),
        tempDoc = document.implementation.createHTMLDocument('tempDoc');
      tempDoc.body.innerHTML = modifiedContainerStr;
      document.body.appendChild(tempDoc.body.firstChild);
    }

    containers = document.getElementsByClassName(containerClasses[0]);
    for (let o = 0, len = containers.length; o < len; o++) {
      let container = containers[o];
      container.style.zIndex = notific8Defaults.zindex;

      onContainerCreateHandlers = notific8ContainerHandlers.onContainerCreate;
      for (let p = 0, len = onContainerCreateHandlers.length; p < len; p++) {
        let handler = onContainerCreateHandlers[p];
        handler(container, options);
      }

      container.addEventListener("click", function(event) {
        let data,
          target = event.target,
          notification = target.parentElement,
          notificationClass = `${options.namespace}-notification`;

        if (notification.className.split(' ').indexOf(notificationClass) === -1) {
          return;
        }

        data = notific8DataStore[notification.id];
        closeNotification(notification.id, data);
      });
    }
  }

  /**
   * Make sure that the edge options are ok
   * @param {Object} options options for building the notification
   */
  function checkEdges(options) {
    options.verticalEdge = (options.verticalEdge || notific8Defaults.verticalEdge).toLowerCase();
    options.horizontalEdge = (options.horizontalEdge || notific8Defaults.horizontalEdge).toLowerCase();
    if (['left', 'right'].indexOf(options.verticalEdge) === -1) {
      options.verticalEdge = notific8Defaults.verticalEdge;
    }
    if (['top', 'bottom'].indexOf(options.horizontalEdge) === -1) {
      options.horizontalEdge = notific8Defaults.horizontalEdge;
    }
  }

  /**
   * Displays an error message to the console and throws an error
   * @param {String} message the error message to display
   */
  function errorMessage(message) {
    console.error(message);
    throw new Error(message);
  }

  /**
   * Register a module for use in the system
   * @param {String} moduleName       name of the module to register
   * @param {String} position         position of the module's excution
   * @param {Object} defaultOptions   default options for the module
   * @param {Function} callbackMethod method to call for the module
   */
  function registerModule(moduleName, position, defaultOptions, callbackMethod) {
    let defaultValue,
      module,
      option,
      modulesRegisteredToPosition,
      validPositions;

    if (typeof moduleName !== 'string' || moduleName.trim() === '') {
      errorMessage("moduleName should be a string");
    }
    validPositions = ['beforeContent', 'afterContent', 'beforeContainer', 'afterContainer', 'insideContainer'];
    if (typeof position !== 'string' || validPositions.indexOf(position) === -1) {
      errorMessage("position should be a string");
    }
    if (typeof defaultOptions !== 'object') {
      errorMessage("defaultOptions should be an object");
    }
    if (typeof callbackMethod !== 'function') {
      errorMessage("callbackMethod should be an function");
    }
    modulesRegisteredToPosition = notific8RegisteredModules[position];
    for (let i = 0, len = modulesRegisteredToPosition.length; i < len; i++) {
      module = modulesRegisteredToPosition[i];
      if (module.moduleName === moduleName) {
        errorMessage(`Module '${moduleName}' has already been registered`);
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
  }

  /**
   * Generates a unique name to assocate with the notification
   * Solution found as an answer on StackOverflow:
   * http://stackoverflow.com/a/2117523/5870787
   * @return {String} string generateiond for the notification
   */
  function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  /**
   * Public method for the notification that drives the plug-in
   * @param  {String} message  message for the notification or notific8 method to call
   * @param  {Options} options options for the notification or notific8 method called
   * @return {Mixed}
   */
  return function(message, options) {
    let callbackMethod,
      containerClass,
      defaultOptions,
      moduleName,
      notificationClass,
      num,
      position;

    if (typeof message !== "string") {
      errorMessage("notific8 takes a string message as the first parameter");
    }
    if (options === undefined) {
      options = {};
    }
    if (typeof options === 'object' && !options.hasOwnProperty('namespace') && message !== 'zindex') {
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
      case "removeFromQueue":
        return removeFromQueue(options);
      case "registerModule":
        if (arguments.length !== 5) {
          errorMessage("Registering a module requires the parameters moduleName, position, defaultOptions, and callbackMethod.");
        }
        message = arguments[0];
        [ , moduleName, position, defaultOptions, callbackMethod ] = arguments;
        return registerModule(moduleName, position, defaultOptions, callbackMethod);
      default:
        containerClass = options.namespace + "-container";
        if (document.getElementsByClassName(containerClass).length === 0) {
          initContainers(options);
        }
        checkEdges(options);
        notificationClass = options.namespace + "-notification";
        num = document.getElementsByClassName(notificationClass).length;
        if (!options.notificationName) {
          options.notificationName = generateUniqueId();
        }
        if (!notific8Defaults.queue || num === 0) {
          init(message, options);
        } else {
          notific8Queue.push({
            message: message,
            options: options
          });
        }
        return options.notificationName;
    }
  };
})();
