import { Notific8Factory } from './notific8-factory';
import { Notific8Options } from './notific8-options';

describe('Notific8Factory tests', () => {
  const notific8DefaultOptions: Notific8Options = {
    closeText: 'close',
      horizontalEdge: 'top',
      life: 10000,
      queue: false,
      sticky: false,
      styleNamespace: 'notific8',
      theme: 'ocho',
      themeColor: 'teal',
      verticalEdge: 'right',
      zIndex: 1100
  };

  describe('Notific8Notification creation method tests', () => {
    const notific8Message = 'This is a test notification';

    xit('should create and return a new instance of Notific8Notification when passing in only a message', () => {
      // @TODO update when implementing Notific8Notification class
    });

    xit('should create and return a new instance of Notific8Notification when passing in a message and options', () => {
      // @TODO update when implementing Notific8Notification class
    });
  });

  it('should return the list of default options', () => {
    const defaultOptions = Notific8Factory.getDefaultOptions();
    expect(defaultOptions).toEqual(notific8DefaultOptions);
  });

  describe('Notific8 option setting methods', () => {
    const notific8FactoryValidOptionsSpy = jasmine.createSpy('isNotific8OptionsObjectValid');
    const originalIsNotific8OptionsObjectValid = Notific8Factory.isNotific8OptionsObjectValid;

    beforeEach(() => {
      Notific8Factory.isNotific8OptionsObjectValid = notific8FactoryValidOptionsSpy;
    });

    it('should set a list of options as the new defaults', () => {
      notific8FactoryValidOptionsSpy.and.returnValue(true);
      const newNotific8DefaultOptions: Notific8Options = {
        horizontalEdge: 'bottom',
        themeColor: 'ruby',
        verticalEdge: 'left'
      };
      Notific8Factory.setDefaultOptions(newNotific8DefaultOptions);
      const updatedNotific8DefaultOptions = Notific8Factory.getDefaultOptions();
      expect(updatedNotific8DefaultOptions).toEqual(Object.assign(notific8DefaultOptions, newNotific8DefaultOptions));
    });

    it('should set a single new default option', () => {
      notific8FactoryValidOptionsSpy.and.returnValue(true);
      Notific8Factory.setDefaultOption('themeColor', 'ruby');
      const updatedNotific8DefaultOptions = Notific8Factory.getDefaultOptions();
      expect(updatedNotific8DefaultOptions).toEqual(Object.assign(notific8DefaultOptions, { themeColor: 'ruby' }));
    });

    it('should throw a TypeError when trying to set a list of new defaults that contains an invalid option', () => {
      notific8FactoryValidOptionsSpy.and.returnValue(false);
      const newNotific8DefaultOptions: Notific8Options = {
        shiz: 'is bananas',
        themeColor: 'ruby',
        verticalEdge: 'left'
      };
      expect(() => { Notific8Factory.setDefaultOptions(newNotific8DefaultOptions); })
        .toThrowError('Invalid properties passed in as part of the options');
    });

    it('should throw a TypeError when trying to set a new default that is an invalid option', () => {
      notific8FactoryValidOptionsSpy.and.returnValue(false);
      expect(() => { Notific8Factory.setDefaultOption('shiz', 'is bananas'); })
        .toThrowError('"shiz" is not a valid Notific8 option property');
    });

    afterAll(() => {
      Notific8Factory.isNotific8OptionsObjectValid = originalIsNotific8OptionsObjectValid;
    });
  });

  describe('isNotific8OptionsObjectValid tests', () => {
    it('should return true for a valid list of options', () => {

      const isValidListOfOptions = Notific8Factory.isNotific8OptionsObjectValid(notific8DefaultOptions);
      expect(isValidListOfOptions).toBe(true);
    });

    it('should return false for an invalid list of options', () => {
      const isValidListOfOptions = Notific8Factory.isNotific8OptionsObjectValid({ jasper: 'is a cat' });
      expect(isValidListOfOptions).toBe(false);
    });
  });
});
