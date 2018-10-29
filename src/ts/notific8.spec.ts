import { Notific8, Notific8Options, Notific8Notification } from './notific8';

describe('Notific8 Notification tests', () => {
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

  it('should create a notification with a title', () => {
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

  it('should create a notification with an image', () => {
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

  it('should create a notification with an image with no alt text', () => {
    const notific8Options = Object.assign(
      {},
      notific8DefaultOptions,
      { imageUrl: 'http://url.com/path/to/url' }
    );
    const testNotification = new Notific8Notification('Image test notification', notific8Options);

    expect((testNotification.notificationHtml.querySelector('.notific8-image') as HTMLImageElement).alt).toBe('');
  });

  describe('notification id', () => {
    it('should generate a notification with an id', () => {
      const notific8Options = Object.assign(
        {},
        notific8DefaultOptions,
        { id: 'test-id' }
      );

      const testNotification = new Notific8Notification('Given ID test', notific8Options);

      expect(testNotification.notificationHtml.id).toBe('test-id');
    });

    it('should generate a notification with an id', () => {
      const notific8Options = Object.assign(
        {},
        notific8DefaultOptions
      );

      const testNotification = new Notific8Notification('Generated ID test', notific8Options);

      expect(testNotification.notificationHtml.id.length).toBe(36);
    });
  });
  
  describe('notification open function', () => {
    it('should open a notification that is not sticky', (done) => {
      jasmine.clock().install();
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          life: 5000
        }
      );
      const testNotification = new Notific8Notification('Test opening non-sticky notification', notific8Options);
      testNotification.open().then(() => {
        expect(testNotification.notificationHtml.classList.contains('notific8-open')).toBe(true);
        jasmine.clock().tick(6000);
        expect(testNotification.notificationHtml.classList.contains('notific8-open')).toBe(false);
        jasmine.clock().uninstall();
        done();
      });
    });
  });

  describe('notification close function', () => {
    it('should close a notification that is sticky', () => {
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          sticky: true
        }
      );
      const testNotification = new Notific8Notification('Test closing sticky notification', notific8Options);
      testNotification.open();
      expect(testNotification.notificationHtml.classList.contains('notific8-open')).toBe(true);
      testNotification.close().then(() => {
        expect(testNotification.notificationHtml.classList.contains('notific8-open')).toBe(false);
      });
    });

    it('should not try to close an already closed notification', () => {
      const closeResolveSpy = jasmine.createSpy('closeResolve');
      const closeRejectSpy = jasmine.createSpy('closeReject');
      const notific8Options = Object.assign(
        notific8DefaultOptions,
        {
          closeReject: closeRejectSpy,
          closeResolve: closeResolveSpy
        }
      );
      const testNotification = new Notific8Notification('Test no double-closing', notific8Options);
      testNotification.open();
      testNotification.close();

      jasmine.clock().install();
      jasmine.clock().tick(11000);
      expect(closeRejectSpy).not.toHaveBeenCalled();
      expect(closeResolveSpy).not.toHaveBeenCalled();
      jasmine.clock().uninstall();
    });
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

    it('should create and return a new instance of Notific8Notification when passing in only a message', (done) => {
      Notific8.create('Message only test').then((testNotification) => {
        const notificationElements = document.querySelectorAll('.notific8-container.top.right notific8-notification');
        expect(notificationElements.length).toBe(1);
        expect((notificationElements[0].querySelector('.notific8-message') as HTMLElement).innerHTML).toBe('Message only test');
        done();
      });
    });

    it('should create and return a new instance of Notific8Notification when passing in a message and options', (done) => {
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
        done();
      });
    });

    it(`should error out in the promise when creating a notification with a bad property`, (done) => {
      Notific8.create('Error on create test', {
        foo: 'bar'
      }).catch((error) => {
        expect(error.message).toBe('Invalid properties passed in as part of the options');
        done();
      });
    });

    afterEach(() => {
      (document.querySelector('body') as HTMLElement).innerHTML = '';
    });
  });

  it('should return the list of default options', () => {
    const defaultOptions = Notific8.getDefaultOptions();
    expect(defaultOptions).toEqual(notific8DefaultOptions);
  });

  describe('Notific8 option setting methods', () => {
    const notific8ValidOptionsSpy = jasmine.createSpy('isNotific8OptionsObjectValid');
    const originalIsNotific8OptionsObjectValid = Notific8.isNotific8OptionsObjectValid;

    beforeEach(() => {
      Notific8.isNotific8OptionsObjectValid = notific8ValidOptionsSpy;
      Notific8.resetDefaultOptions();
    });

    it('should set a list of options as the new defaults', () => {
      notific8ValidOptionsSpy.and.returnValue(true);
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

    it('should set a single new default option', () => {
      notific8ValidOptionsSpy.and.returnValue(true);
      Notific8.setDefaultOption('themeColor', 'ruby');
      const updatedNotific8DefaultOptions = Notific8.getDefaultOptions();
      expect(updatedNotific8DefaultOptions).toEqual(Object.assign({}, notific8DefaultOptions, { themeColor: 'ruby' }));
    });

    it('should throw a TypeError when trying to set a list of new defaults that contains an invalid option', () => {
      notific8ValidOptionsSpy.and.returnValue(false);
      const newNotific8DefaultOptions: Notific8Options = {
        shiz: 'is bananas',
        themeColor: 'ruby',
        verticalEdge: 'left'
      };
      expect(() => { Notific8.setDefaultOptions(newNotific8DefaultOptions); })
        .toThrowError('Invalid properties passed in as part of the options');
    });

    it('should throw a TypeError when trying to set a new default that is an invalid option', () => {
      notific8ValidOptionsSpy.and.returnValue(false);
      expect(() => { Notific8.setDefaultOption('shiz', 'is bananas'); })
        .toThrowError('"shiz" is not a valid Notific8 option property');
    });

    afterAll(() => {
      Notific8.isNotific8OptionsObjectValid = originalIsNotific8OptionsObjectValid;
    });
  });

  describe('isNotific8OptionsObjectValid tests', () => {
    it('should return true for a valid list of options', () => {
      const isValidListOfOptions = Notific8.isNotific8OptionsObjectValid(notific8DefaultOptions);
      expect(isValidListOfOptions).toBe(true);
    });

    it('should return false for an invalid list of options', () => {
      const isValidListOfOptions = Notific8.isNotific8OptionsObjectValid({ jasper: 'is a cat' });
      expect(isValidListOfOptions).toBe(false);
    });
  });

  describe('ensureEdgeContainerExists tests', () => {
    it(`should create the container if it doesn't already exist`, () => {
      const containerSelector = '.notific8-container.right.top';
      expect(document.querySelectorAll(containerSelector).length).toBe(0);
      Notific8.create('ensureEdgeContainerExists test to create container');
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
    });

    it('should not create a container element if it already exists', () => {
      document.write('<aside class="notific8-container top right"></aside>');

      const containerSelector = '.notific8-container.right.top';
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
      Notific8.create('ensureEdgeContainerExists test to create container');
      expect(document.querySelectorAll(containerSelector).length).toBe(1);
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
});
