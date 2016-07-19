
/*
@author Will Steinmetz
Close all module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function(window) {
  var buildClasses, buildHtml, closeAllCallback, getCloseAllButton, getContainer, getNumberOfNotifications, notific8Data;
  notific8Data = null;

  /*
  Build the HTML for close all
  @return string
   */
  buildHtml = function() {
    var closeAllClasses;
    if (notific8Data.closeAll) {
      closeAllClasses = ["" + notific8Data.namespace + "-closeall-button", notific8Data.closeAllTheme, notific8Data.closeAllColor];
      return "<a class=\"" + (closeAllClasses.join(' ')) + "\"\n  href=\"#\">\n  " + notific8Data.closeAllText + "\n</a>";
    } else {
      return "";
    }
  };

  /*
  Build the classes array for close all
  @return string
   */
  buildClasses = function() {
    if (notific8Data.closeAll) {
      return ["" + notific8Data.namespace + "-closeall"];
    } else {
      return [];
    }
  };

  /*
  Setup the callback for the notification
  @return object
   */
  closeAllCallback = function(data) {
    notific8Data = data;
    return {
      classes: buildClasses(),
      html: buildHtml()
    };
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
  Get the number of notifications in the container
  @params object data
  @return number
   */
  getNumberOfNotifications = function(data) {
    var container, namespace;
    container = getContainer(data);
    namespace = data.settings.namespace;
    return container.querySelectorAll("." + namespace + "-notification.open").length;
  };

  /*
  Get the close all button
  @params object data
  @return object
   */
  getCloseAllButton = function(data) {
    var container, namespace;
    container = getContainer(data);
    namespace = data.settings.namespace;
    return container.querySelector("." + namespace + "-closeall-button");
  };
  notific8('configure', {
    onCreate: function(notification, data) {
      var closeButton;
      if (!notific8Defaults.closeAll) {
        return;
      }
      if (getNumberOfNotifications(data) > 0) {
        closeButton = getCloseAllButton(data);
        return closeButton.style.display = 'block';
      }
    }
  });
  notific8('configure', {
    onClose: function(notification, data) {
      var closeButton;
      if (!notific8Defaults.closeAll) {
        return;
      }
      if (getNumberOfNotifications(data) <= 1) {
        closeButton = getCloseAllButton(data);
        return closeButton.style.display = 'none';
      }
    }
  });
  notific8('configure', {
    onContainerCreate: function(container, options) {
      var containerClasses, containerPosition;
      containerPosition = '';
      containerClasses = container.className.split(' ');
      containerPosition += containerClasses.indexOf('top') > -1 ? 'top' : 'bottom';
      containerPosition += containerClasses.indexOf('right') > -1 ? 'Right' : 'Left';
      return container.addEventListener("click", function(event) {
        var closeAllButtonClass, namespace, notification, notificationClass, notifications, target, _fn, _i, _len;
        event.preventDefault();
        target = event.target;
        namespace = options.namespace;
        closeAllButtonClass = "" + namespace + "-closeall-button";
        if (target.className.split(' ').indexOf(closeAllButtonClass) === -1) {
          return;
        }
        notificationClass = "." + namespace + "-notification.open";
        notifications = container.querySelectorAll(notificationClass);
        _fn = function(n, namespace) {
          return n.querySelector("." + namespace + "-close").click();
        };
        for (_i = 0, _len = notifications.length; _i < _len; _i++) {
          notification = notifications[_i];
          _fn(notification, namespace);
        }
      });
    }
  });
  return notific8('registerModule', 'closeall', 'insideContainer', {
    closeAll: false,
    closeAllText: 'Close All',
    closeAllTheme: 'legacy',
    closeAllColor: 'teal'
  }, closeAllCallback);
})(window);

//# sourceMappingURL=notific8-closeall.js.map
