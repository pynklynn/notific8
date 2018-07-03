import { Notific8Options } from './notific8-options';
import { Notific8Notification } from './notific8-notification';

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
      styleNamespace: 'notific8',
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