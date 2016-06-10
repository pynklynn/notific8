
/*
@author Will Steinmetz
Icon module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function(window) {
  var buildClasses, buildHtml, hasIcon, iconCallback, notific8Data;
  notific8Data = null;

  /*
  Check whether or not a valid icon is set for this notification
  @return boolean
   */
  hasIcon = function() {
    return (notific8Data.settings.icon != null) && (typeof notific8Data.settings.icon === "string");
  };

  /*
  Build the HTML for the icon
  @return string
   */
  buildHtml = function() {
    var classes;
    if (hasIcon()) {
      classes = ["" + notific8Data.settings.namespace + "-icon", "" + notific8Data.settings.namespace + "-fontastic-" + notific8Data.settings.icon];
      return "<i class=\"" + (classes.join(' ')) + "\"></i>";
    } else {
      return "";
    }
  };

  /*
  Build the array of classes that need to be attached to the notification
  @return array
   */
  buildClasses = function() {
    if (hasIcon()) {
      return ["has-icon"];
    }
    return [];
  };

  /*
  Setup the callback for the notification
  @return object
   */
  iconCallback = function(data) {
    notific8Data = data;
    return {
      classes: buildClasses(),
      html: buildHtml()
    };
  };
  return notific8('registerModule', 'icon', 'beforeContent', {
    icon: false
  }, iconCallback);
})(window);

//# sourceMappingURL=notific8-icon.js.map
