/**
 * @author Will Steinmetz
 * Notification Javascript plug-in - jQuery wrapper
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
(function($) {
  /**
   * wrapper since this plug-in is called without selecting an element first
   * @param string message
   * @param object options
   */
  $.notific8 = function(message, options) {
    notific8(message, options);
  };
})(jQuery);
