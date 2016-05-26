
/*
 * @author Will Steinmetz
 * Test suite for the notific8 JavaScript plug-in
 * Copyright (c)2013-2016, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
describe('notific8 methods', function() {
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
  it('should remove the current notification', function() {
    var notificationClass, notifications;
    notificationClass = "" + notific8Defaults.namespace + "-notification";
    notific8('hello world!');
    notifications = document.getElementsByClassName(notificationClass);
    expect(notifications.length).toEqual(1);
    notific8('remove');
    notifications = document.getElementsByClassName(notificationClass);
    expect(notifications.length).toEqual(0);
  });
  xit('should register a new module', function() {});
});

describe('notific8 configruation setting', function() {
  var customConfig;
  customConfig = {
    life: 20000,
    theme: 'atomic',
    color: 'pear',
    sticky: true,
    verticalEdge: 'left',
    horizontalEdge: 'bottom',
    zindex: 1200,
    icon: 'pencil',
    closeText: 'exit',
    onInit: null,
    onCreate: null,
    onClose: null,
    namespace: 'custom',
    height: {
      atomic: 80,
      chicchat: 80,
      legacy: 80
    }
  };
  it('should set the configuration via the configure method', function() {
    notific8('configure', customConfig);
    expect(notific8Defaults.life).toEqual(20000);
    expect(notific8Defaults.theme).toEqual('atomic');
    expect(notific8Defaults.color).toEqual('pear');
    expect(notific8Defaults.sticky).toEqual(true);
    expect(notific8Defaults.verticalEdge).toEqual('left');
    expect(notific8Defaults.horizontalEdge).toEqual('bottom');
    expect(notific8Defaults.zindex).toEqual(1200);
    expect(notific8Defaults.icon).toEqual('pencil');
    expect(notific8Defaults.closeText).toEqual('exit');
    expect(notific8Defaults.namespace).toEqual('custom');
    expect(notific8Defaults.height.atomic).toEqual(80);
    expect(notific8Defaults.height.chicchat).toEqual(80);
    expect(notific8Defaults.height.legacy).toEqual(80);
  });
  it('should set the configuration via the config method', function() {
    notific8('config', customConfig);
    expect(notific8Defaults.life).toEqual(20000);
    expect(notific8Defaults.theme).toEqual('atomic');
    expect(notific8Defaults.color).toEqual('pear');
    expect(notific8Defaults.sticky).toEqual(true);
    expect(notific8Defaults.verticalEdge).toEqual('left');
    expect(notific8Defaults.horizontalEdge).toEqual('bottom');
    expect(notific8Defaults.zindex).toEqual(1200);
    expect(notific8Defaults.icon).toEqual('pencil');
    expect(notific8Defaults.closeText).toEqual('exit');
    expect(notific8Defaults.namespace).toEqual('custom');
    expect(notific8Defaults.height.atomic).toEqual(80);
    expect(notific8Defaults.height.chicchat).toEqual(80);
    expect(notific8Defaults.height.legacy).toEqual(80);
  });
});
