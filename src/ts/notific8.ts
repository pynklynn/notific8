import { Notific8Options } from './notific8-options';
import { Notific8Notification } from './notific8-notification';

export namespace Notific8 {
  let notific8DefaultOptions: Notific8Options;
  resetDefaultOptions();

  export function resetDefaultOptions(): void {
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
  }

  export function getDefaultOptions(): Notific8Options {
    return notific8DefaultOptions;
  }

  export function setDefaultOptions(newDefaultOptions: Notific8Options): void {
    validateOptionsObject(newDefaultOptions);

    notific8DefaultOptions = Object.assign(notific8DefaultOptions, newDefaultOptions);
  }

  export function setDefaultOption(option: string, newValue: string|number|boolean): void {
    if (!Notific8.isNotific8OptionsObjectValid({ option })) {
      throw new TypeError(`"${option}" is not a valid Notific8 option property`);
    }

    notific8DefaultOptions[option] = newValue;
  }

  export function isNotific8OptionsObjectValid(optionsToCheck: object): boolean {
    const defaultOptionsKeys = new Set(Object.keys(notific8DefaultOptions));
    const optionsToCheckKeys = new Set(Object.keys(optionsToCheck));
    const keysIntersection = new Set(
      [...Array.from(optionsToCheckKeys)].filter((key: string) => defaultOptionsKeys.has(key))
    );

    return keysIntersection.size === optionsToCheckKeys.size;
  }

  export function create(message: string, notificationOptions: Notific8Options = notific8DefaultOptions): Promise<Notific8Notification> {
    return new Promise<Notific8Notification>(((resolve, reject) => {
      try {
        notificationOptions = Object.assign({}, notific8DefaultOptions, notificationOptions);
        validateOptionsObject(notificationOptions);
        ensureEdgeContainerExists(notificationOptions);
        const notification = new Notific8Notification(message, notificationOptions);
    
        // @TODO check for and handle queue
        addNotificationToContainer(notificationOptions, notification);

        resolve(notification);
      } catch(error) {
        reject(error);
      }
    }));
  }

  function addNotificationToContainer(notificationOptions: Notific8Options, notification: Notific8Notification): void {
    const { horizontalEdge, verticalEdge, styleNamespace } = notificationOptions;
    const containerSelector = `.${styleNamespace}-container.${horizontalEdge}.${verticalEdge}`;
    (document.querySelector(containerSelector) as HTMLElement).appendChild(notification.notificationHtml);
  }

  function ensureEdgeContainerExists(notificationOptions: Notific8Options): void {
    const { horizontalEdge, verticalEdge, styleNamespace } = notificationOptions;
    const containerSelector = `.${styleNamespace}-container.${horizontalEdge}.${verticalEdge}`;

    if (!document.querySelectorAll(containerSelector).length) {
      const containerElement = document.createElement('aside');
      containerElement.classList.add(`${styleNamespace}-container`, horizontalEdge as string, verticalEdge as string);
      document.body.appendChild(containerElement);
    }
  }

  function validateOptionsObject(notific8Options: Notific8Options): boolean {
    if (!Notific8.isNotific8OptionsObjectValid(notific8Options)) {
      throw new TypeError('Invalid properties passed in as part of the options');
    }

    return true;
  }
}
