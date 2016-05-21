
/*
@author Will Steinmetz
Icon module for the notific8 notification plug-in initially inspired by the
notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function(window) {
  var buildClasses, buildHtml, hasIcon, iconCallback, notific8Data;
  notific8Data = null;
  hasIcon = function(data) {
    return (data.settings.icon != null) && (typeof data.settings.icon === "string");
  };
  buildHtml = function(data) {
    var classes;
    if (hasIcon(data)) {
      classes = ["" + data.settings.namespace + "-icon", "" + data.settings.namespace + "-fontastic-" + data.settings.icon];
      return "<i class=\"" + (classes.join(' ')) + "\"></i>";
    } else {
      return "";
    }
  };
  buildClasses = function(data) {
    if (hasIcon(data)) {
      return ["has-icon"];
    }
    return [];
  };
  iconCallback = function(data) {
    return {
      classes: buildClasses(data),
      html: buildHtml(data)
    };
  };
  return notific8('registerModule', 'icon', 'beforeContent', {
    icon: false
  }, iconCallback);
})(window);

//# sourceMappingURL=notific8-module.icon.js.map
