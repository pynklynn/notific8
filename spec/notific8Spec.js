
/*
 * @author Will Steinmetz
 * Test suite for the notific8 JavaScript plug-in
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
describe('notific8', function() {
  xit('should set the configuration via the configuration method', function() {});
  xit('should set the configuration via the config method', function() {});
  it('should set the default z-index to 5000', function() {
    notific8('zindex', 5000);
    expect(notific8Defaults.zindex).toEqual(5000);
  });
  it('should destroy the notification containers', function() {
    var containerClass, containers;
    notific8('hello world!');
    notific8('destroy');
    containerClass = "" + notific8Defaults.namespace + "-container";
    containers = document.getElementsByClassName(containerClass);
    expect(containers.length).toEqual(0);
  });
  xit('should remove the current notification', function() {});
  xit('should register a new module', function() {});
});
