
/*
 * @author Will Steinmetz
 * Test suite for the notific8 JavaScript plug-in
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
describe('notific-icon module', function() {
  beforeEach(function() {
    return notific8('remove');
  });
  return it('should add an icon to the notification', function() {
    var notification, notificationClass, notificationicon, notificationiconClass;
    notific8('This is testing the icon module', {
      icon: 'icon'
    });
    notificationClass = "" + notific8Defaults.namespace + "-notification";
    notification = document.getElementsByClassName(notificationClass)[0];
    notificationiconClass = "." + notific8Defaults.namespace + "-icon";
    notificationicon = notification.querySelectorAll(notificationiconClass);
    return expect(notificationicon.length).toEqual(1);
  });
});
