/**
 * @license
 * Copyright (c) 2013-2019 Pynk Lynn, LLC
 * This code may only be used under the MIT style license found at
 * https://github.com/pynklynn/notific8/blob/master/LICENSE
 */

import { Notific8, Notific8Options, Notific8Notification } from './notific8';

describe('Notific8 Notification tests', () => {
  let notific8DefaultOptions: Notific8Options;

  beforeEach(() => {
    notific8DefaultOptions = {
      actionButtons: undefined,
      closeHelpText: 'close',
      closeReject: undefined,
      closeResolve: undefined,
      horizontalEdge: 'top',
      id: undefined,
      imageAltText: undefined,
      imageUrl: undefined,
      life: 10000,
      queue: false,
      queueOpenReject: undefined,
      queueOpenResolve: undefined,
      sticky: false,
      title: undefined,
      theme: 'ocho',
      themeColor: 'teal',
      verticalEdge: 'right',
      zIndex: 1100
    };

    document.write('<notific8-container top right></notific8-container>');
  });

  test('should create a notification with a title', () => {
    const notificationOptions = Object.assign(
      {},
      notific8DefaultOptions,
      { title: 'Notification title', zIndex: 5000 }
    );
    const testNotification = new Notific8Notification('Title test notification', notificationOptions);

    expect(testNotification.notificationHtml.querySelectorAll('.notific8-header').length).toBe(1);
    expect(testNotification.notificationHtml.querySelectorAll('.notific8-title').length).toBe(1);
    expect(testNotification.notificationHtml.querySelectorAll('.notific8-close-button').length).toBe(1);
    expect(testNotification.notificationHtml.style.zIndex).toBe('5000');
  });

  test('should create a notification with an image', () => {
    const notific8Options = Object.assign(
      {},
      notific8DefaultOptions,
      { imageUrl: 'http://url.com/path/to/url', imageAltText: 'Image alt' }
    );
    const testNotification = new Notific8Notification('Image test notification', notific8Options);
    const testNotificationImage = testNotification.notificationHtml.querySelector('.notific8-image') as HTMLImageElement;
    const testNotificationMessage = testNotification.notificationHtml.querySelectorAll('.notific8-message');

    expect(testNotificationImage.src).toBe('http://url.com/path/to/url');
    expect(testNotificationImage.alt).toBe('Image alt');
    expect(testNotificationMessage.length).toBe(1);
    expect(testNotificationMessage[0].innerHTML).toBe('Image test notification');
  });

  test('should create a notification with an image with no alt text', () => {
    const notific8Options = Object.assign(
      {},
      notific8DefaultOptions,
      { imageUrl: 'http://url.com/path/to/url' }
    );
    const testNotification = new Notific8Notification('Image test notification', notific8Options);

    expect((testNotification.notificationHtml.querySelector('.notific8-image') as HTMLImageElement).alt).toBe('');
  });

  test('should create a notification with action buttons', () => {
    const notific8Options = Object.assign(
      {},
      notific8DefaultOptions,
      { actionButtons: [ { buttonText: 'Close' } ] }
    );
    const testNotification = new Notific8Notification('Action buttons test notification', notific8Options);
    const testNotificationButtons = testNotification.notificationHtml.querySelectorAll('.notific8-action-button');
    const testNotificationMessage = testNotification.notificationHtml.querySelectorAll('.notific8-message');

    expect(testNotificationButtons.length).toBe(1);
    expect(testNotificationMessage.length).toBe(1);
    expect(testNotificationMessage[0].innerHTML).toBe('Action buttons test notification');
  });

  describe('notification id', () => {
    test('should generate a notification with an id', () => {
      const notific8Options = Object.assign(
        {},
        notific8DefaultOptions,
        { id: 'test-id' }
      );

      const testNotification = new Notific8Notification('Given ID test', notific8Options);

      expect(testNotification.notificationHtml.id).toBe('test-id');
    });

    test('should generate a notification with an id', () => {
      const notific8Options = Object.assign(
        {},
        notific8DefaultOptions
      );

      const testNotification = new Notific8Notification('Generated ID test', notific8Options);

      expect(testNotification.notificationHtml.id.length).toBe(36);
    });
  });
  
  describe('notification open function', () => {
    beforeEach(() => jest.useFakeTimers());

    test('should open a notification that is not sticky', () => {
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          life: 5000
        }
      );
      const testNotification = new Notific8Notification('Test opening non-sticky notification', notific8Options);
      testNotification.open().then(() => {
        expect(testNotification.notificationHtml.hasAttribute('open')).toBe(true);
        jest.runOnlyPendingTimers();
        expect(testNotification.notificationHtml.hasAttribute('open')).toBe(false);
      });
    });

    test('should mark a notification as sticky', () => {
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          life: 5000,
          sticky: true
        }
      );
      const testNotification = new Notific8Notification('Test opening non-sticky notification', notific8Options);
      testNotification.open().then(() => {
        expect(testNotification.notificationHtml.hasAttribute('sticky')).toBe(true);
      });
    });

    test('should reopen an existing notification', () => {
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          life: 500
        }
      );
      const testNotification = new Notific8Notification('Testing reusing a notification', notific8Options);
      spyOn(Notific8, 'queueOrAddToContainer');
      testNotification.open().then(() => {
        testNotification.close();
        testNotification.open().then(async() => {
          expect(Notific8.queueOrAddToContainer).toHaveBeenCalled();
        });
        jest.runOnlyPendingTimers();
      });
      jest.runOnlyPendingTimers();
    });
  });

  describe('notification close function', () => {
    beforeEach(() => jest.useFakeTimers());

    test('should close a notification that is sticky', () => {
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          sticky: true
        }
      );
      const testNotification = new Notific8Notification('Test closing sticky notification', notific8Options);
      testNotification.open().then(() => {
        expect(testNotification.notificationHtml.hasAttribute('open')).toBe(true);
        testNotification.close().then(() => {
          expect(testNotification.notificationHtml.hasAttribute('open')).toBe(false);
        });
      });
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});

describe('Notific8 tests', () => {
  let notific8DefaultOptions: Notific8Options;

  beforeEach(() => {
    notific8DefaultOptions = {
      closeHelpText: 'close',
      closeReject: undefined,
      closeResolve: undefined,
      horizontalEdge: 'top',
      id: undefined,
      imageAltText: undefined,
      imageUrl: undefined,
      life: 10000,
      queue: false,
      sticky: false,
      title: undefined,
      theme: 'ocho',
      themeColor: 'teal',
      verticalEdge: 'right',
      zIndex: 1100
    };
  });

  describe('Notific8Notification creation method tests', () => {
    const notific8Message = 'This is a test notification';

    test('should create and return a new instance of Notific8Notification when passing in only a message', () => {
      Notific8.create('Message only test').then((testNotification) => {
        const notificationElements = document.querySelectorAll('.notific8-container.top.right notific8-notification');
        expect(notificationElements.length).toBe(1);
        expect((notificationElements[0].querySelector('.notific8-message') as HTMLElement).innerHTML).toBe('Message only test');
      });
    });

    test('should create and return a new instance of Notific8Notification when passing in a message and options', () => {
      Notific8.create('Message and configuration test', {
        horizontalEdge: 'bottom',
        theme: 'materialish',
        themeColor: 'lollipop',
        verticalEdge: 'left'
      }).then((notification) => {;
        const notificationElements = document.querySelectorAll('.notific8-container.bottom.left notific8-notification');
        expect(notificationElements.length).toBe(1);
        expect((notificationElements[0].querySelector('.notific8-message') as HTMLElement).innerHTML).toBe('Message and configuration test');
        expect((notificationElements[0].classList.contains('materialish'))).toBe(true);
        expect((notificationElements[0].classList.contains('lollipop'))).toBe(true);
      });
    });

    test(`should error out in the promise when creating a notification with a bad property`, () => {
      Notific8.create('Error on create test', {
        foo: 'bar'
      }).catch((error) => {
        expect(error.message).toBe('Invalid properties passed in as part of the options');
      });
    });

    afterEach(() => {
      (document.querySelector('body') as HTMLElement).innerHTML = '';
    });
  });

  test('should return the list of default options', () => {
    const defaultOptions = Notific8.getDefaultOptions();
    expect(defaultOptions).toEqual(notific8DefaultOptions);
  });

  describe('Notific8 option setting methods', () => {
    const notific8ValidOptionsSpy = jest.fn();
    const originalIsNotific8OptionsObjectValid = Notific8.isNotific8OptionsObjectValid;

    beforeEach(() => {
      Notific8.isNotific8OptionsObjectValid = notific8ValidOptionsSpy;
      Notific8.resetDefaultOptions();
    });

    test('should set a list of options as the new defaults', () => {
      notific8ValidOptionsSpy.mockReturnValue(true);
      const newNotific8DefaultOptions: Notific8Options = {
        horizontalEdge: 'bottom',
        themeColor: 'ruby',
        verticalEdge: 'left'
      };
      Notific8.setDefaultOptions(newNotific8DefaultOptions);
      const updatedNotific8DefaultOptions = Notific8.getDefaultOptions();
      expect(updatedNotific8DefaultOptions).toEqual(
        Object.assign({}, notific8DefaultOptions, newNotific8DefaultOptions)
      );
    });

    test('should set a single new default option', () => {
      notific8ValidOptionsSpy.mockReturnValue(true);
      Notific8.setDefaultOption('themeColor', 'ruby');
      const updatedNotific8DefaultOptions = Notific8.getDefaultOptions();
      expect(updatedNotific8DefaultOptions).toEqual(Object.assign({}, notific8DefaultOptions, { themeColor: 'ruby' }));
    });

    test('should throw a TypeError when trying to set a list of new defaults that contains an invalid option', () => {
      notific8ValidOptionsSpy.mockReturnValue(false);
      const newNotific8DefaultOptions: Notific8Options = {
        shiz: 'is bananas',
        themeColor: 'ruby',
        verticalEdge: 'left'
      };
      expect(() => { Notific8.setDefaultOptions(newNotific8DefaultOptions); })
        .toThrowError('Invalid properties passed in as part of the options');
    });

    test('should throw a TypeError when trying to set a new default that is an invalid option', () => {
      notific8ValidOptionsSpy.mockReturnValue(false);
      expect(() => { Notific8.setDefaultOption('shiz', 'is bananas'); })
        .toThrowError('"shiz" is not a valid Notific8 option property');
    });

    afterAll(() => {
      Notific8.isNotific8OptionsObjectValid = originalIsNotific8OptionsObjectValid;
    });
  });

  describe('isNotific8OptionsObjectValid tests', () => {
    test('should return true for a valid list of options', () => {
      const isValidListOfOptions = Notific8.isNotific8OptionsObjectValid(notific8DefaultOptions);
      expect(isValidListOfOptions).toBe(true);
    });

    test('should return false for an invalid list of options', () => {
      const isValidListOfOptions = Notific8.isNotific8OptionsObjectValid({ jasper: 'is a cat' });
      expect(isValidListOfOptions).toBe(false);
    });
  });

  describe('ensureEdgeContainerExists tests', () => {
    test(`should create the container if it doesn't already exist`, () => {
      const containerSelector = 'notific8-container[right][top]';
      expect(document.querySelectorAll(containerSelector).length).toBe(0);
      Notific8.create('ensureEdgeContainerExists test to create container');
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
    });

    test('should not create a container element if it already exists', () => {
      document.write('<notific8-container top right></notific8-container>');

      const containerSelector = 'notific8-container[right][top]';
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
      Notific8.create('ensureEdgeContainerExists test to create container');
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
    });
  });

  describe('queueOrAddToContainer tests', () => {
    beforeEach(() => jest.useFakeTimers());

    test('should queue a notification', (done) => {
      const notification2Options = Object.assign(
        {},
        notific8DefaultOptions,
        { queue: true }
      );
      Notific8.create('Queued notification 1').then((notification1) => {
        notification1.open().then(() => {
          Notific8.create('Queued notification 2', notification2Options).then((notification2) => {
            expect(Notific8.hasQueuedNotifications()).toBe(true);
            done();
          });
        });
        jest.runOnlyPendingTimers();
      });
    });

    test('should not queue a notification', (done) => {
      Notific8.create('Queued notification 1').then((notification1) => {
        notification1.open().then(() => {
          Notific8.create('Queued notification 2').then((notification2) => {
            expect(document.querySelectorAll('notific8-notification').length).toBe(2);
            done();
          });
        });
        jest.runOnlyPendingTimers();
      });
    });
  });

  describe('triggerQueue tests', () => {
    beforeEach(() => jest.useFakeTimers());

    test('should trigger a queue to open', () => {
      const openResolveSpy = jasmine.createSpy('queueOpenResolve');
      const notification2Options = Object.assign(
        {},
        notific8DefaultOptions,
        {
          queueOpenResolve: openResolveSpy,
          queue: true
        }
      );

      Notific8.create('Trigger queue test 1').then((notification1) => {
        notification1.open().then(() => {
          Notific8.create('Trigger queue 2', notification2Options).then((notification2) => {
            notification1.close().then(() => {
              jest.runOnlyPendingTimers();
              expect(openResolveSpy).toHaveBeenCalled();
            });
            jest.runOnlyPendingTimers();
          });
        });
        jest.runOnlyPendingTimers();
      });
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
