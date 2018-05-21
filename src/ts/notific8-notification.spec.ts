import { Notific8Options } from './notific8-options';
import { Notific8Notification } from './notific8-notification';

describe('Notific8 Notification tests', () => {
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
});