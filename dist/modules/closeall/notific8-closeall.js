
/*
@author Will Steinmetz
Close all module for the notific8 notification plug-in
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
 */
(function(window) {
  var buildClasses, buildHtml, closeAllCallback, notific8Data;
  notific8Data = null;

  /*
  Build the HTML for close all
  @return string
   */
  buildHtml = function() {
    var closeAllClasses;
    if (notific8Data.closeAll) {
      closeAllClasses = ["" + notific8Data.namespace + "-closeall-button", notific8Data.closeAllTheme, notific8Data.closeAllColor];
      return "<a class=\"" + (closeAllClasses.join(' ')) + "\"\n  href=\"javascript:void(0);\">\n  " + notific8Data.closeAllText + "\n</a>";
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
  return notific8('registerModule', 'closeall', 'insideContainer', {
    closeAll: false,
    closeAllText: 'Close All',
    closeAllTheme: 'legacy',
    closeAllColor: 'teal'
  }, closeAllCallback);
})(window);

//# sourceMappingURL=notific8-closeall.js.map
