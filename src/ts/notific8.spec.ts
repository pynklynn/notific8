import { Notific8 } from './notific8';
import { Notific8Options } from './notific8-options';

describe('Notific8 tests', () => {
  let notific8DefaultOptions: Notific8Options;

  beforeEach(() => {
    notific8DefaultOptions = {
      closeHelpText: 'close',
      horizontalEdge: 'top',
      id: undefined,
      imageAltText: undefined,
      imageUrl: undefined,
      life: 10000,
      queue: false,
      sticky: false,
      styleNamespace: 'notific8',
      title: undefined,
      theme: 'ocho',
      themeColor: 'teal',
      verticalEdge: 'right',
      zIndex: 1100
    };
  });

  describe('Notific8Notification creation method tests', () => {
    const notific8Message = 'This is a test notification';

    it('should create and return a new instance of Notific8Notification when passing in only a message', () => {
      const testNotification = Notific8.create('Message only test');
      const notificationElements = document.querySelectorAll('.notific8-container.top.right notific8-notification');
      expect(notificationElements.length).toBe(1);
      expect((notificationElements[0].querySelector('.notific8-message') as HTMLElement).innerHTML).toBe('Message only test');
    });

    it('should create and return a new instance of Notific8Notification when passing in a message and options', () => {
      const testNotification = Notific8.create('Message and configuration test', {
        horizontalEdge: 'bottom',
        theme: 'materialish',
        themeColor: 'lollipop',
        verticalEdge: 'left'
      });
      const notificationElements = document.querySelectorAll('.notific8-container.bottom.left notific8-notification');
      expect(notificationElements.length).toBe(1);
      expect((notificationElements[0].querySelector('.notific8-message') as HTMLElement).innerHTML).toBe('Message and configuration test');
      expect((notificationElements[0].classList.contains('materialish'))).toBe(true);
      expect((notificationElements[0].classList.contains('lollipop'))).toBe(true);
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
