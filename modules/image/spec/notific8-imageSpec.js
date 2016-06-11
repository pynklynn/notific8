
/*
 * @author Will Steinmetz
 * Test suite for the notific8 JavaScript plug-in
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
describe('notific-image module', function() {
  beforeEach(function() {
    return notific8('remove');
  });
  return it('should add an image to the notification', function() {
    var notification, notificationClass, notificationImage, notificationImageClass;
    notific8('This is testing the image module', {
      image: 'image'
    });
    notificationClass = "" + notific8Defaults.namespace + "-notification";
    notification = document.getElementsByClassName(notificationClass)[0];
    notificationImageClass = "." + notific8Defaults.namespace + "-image";
    notificationImage = notification.querySelectorAll(notificationImageClass);
    return expect(notificationImage.length).toEqual(1);
  });
});
