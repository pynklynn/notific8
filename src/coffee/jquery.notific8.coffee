###
@author Will Steinmetz
Notification plug-in inspired by the notification style of Windows 8
Copyright (c)2013-2016, Will Steinmetz
Licensed under the BSD license.
http://opensource.org/licenses/BSD-3-Clause
###

(($) ->
  ###
  wrapper since this plug-in is called without selecting an element first
  @param string message
  @param object options
  ###
  $.notific8 = (message, options) ->
    notific8 message, options

  return
) jQuery
