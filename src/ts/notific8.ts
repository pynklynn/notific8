export interface Notific8Options {
  closeHelpText?: string;
  closeReject?: Function;
  closeResolve?: Function;
  horizontalEdge?: 'top'|'bottom';
  id?: string;
  imageAltText?: string;
  imageUrl?: string;
  life?: number;
  queue?: boolean;
  sticky?: boolean;
  title?: string;
  theme?: string;
  themeColor?: string;
  verticalEdge?: 'left'|'right';
  zIndex?: number;
  [key: string]: string|number|boolean|Function|undefined;
  // @TODO add in actions for buttons
}

export class Notific8Notification {
  private closeTimeout?: number;
  public notificationHtml!: HTMLElement;

  constructor(public message: string, public notificationOptions: Notific8Options) {
    this.buildNotificationHtml();
  }

  public open(): Promise<void> {
    const { life, sticky } = this.notificationOptions;

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          this.notificationHtml.setAttribute('open', '');

          if (!sticky) {
            let { closeReject, closeResolve } = this.notificationOptions;
            closeReject = closeReject || function() {};
            closeResolve = closeResolve || function() {};

            this.closeTimeout = setTimeout(() => {
              this.close().then(() => {
                (closeResolve as Function)();
              }).catch((e) => {
                (closeReject as Function)(e);
              });
            }, life);
          } else {
            this.notificationHtml.setAttribute('sticky', '');
          }

          resolve();
        } catch(e) {
          reject();
        }
      }, 5);
    });
  }

  public close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
      try {
        this.notificationHtml.removeAttribute('open');
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }

  protected buildNotificationHtml(): void {
    const { theme, themeColor, zIndex, imageUrl } = this.notificationOptions;

    this.notificationHtml = document.createElement('notific8-notification');
    this.notificationHtml.classList.add(theme as string, themeColor as string);
    this.notificationHtml.style.zIndex = (zIndex as number).toString();
    this.buildNotificationId();
    this.notificationHtml.appendChild(this.buildNotificationCloseButton());
    if (imageUrl) {
      this.notificationHtml.setAttribute('image', '');
      this.notificationHtml.appendChild(this.buildNotificationImage());
    }
    this.notificationHtml.appendChild(this.buildNotificationContent());
  }
  
  protected buildNotificationId(): void {
    const { id } = this.notificationOptions;
    
    if (id) {
      this.notificationHtml.id = id;
    } else {
      this.notificationHtml.id = this.generateUniqueId();
    }
  }

  // Solution found as an answer on StackOverflow:
  // http://stackoverflow.com/a/2117523/5870787
  protected generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  protected buildNotificationHeader(): HTMLElement {
    const { title } = this.notificationOptions;
    const notificationHeader = document.createElement('header');

    notificationHeader.classList.add('notific8-header');
    if (title) {
      notificationHeader.appendChild(this.buildNotificationTitle());
    }

    return notificationHeader;
  }

  protected buildNotificationTitle(): HTMLElement {
    const { title } = this.notificationOptions;
    const notificationTitle = document.createElement('span');
    
    notificationTitle.classList.add('notific8-title');
    notificationTitle.innerText = title as string;

    return notificationTitle;
  }

  protected buildNotificationCloseButton(): HTMLElement {
    const { closeHelpText } = this.notificationOptions;
    const notificationCloseButton = document.createElement('span');
    notificationCloseButton.classList.add('notific8-close-button');
    notificationCloseButton.title = closeHelpText as string;
    notificationCloseButton.innerHTML = '&times;';

    notificationCloseButton.addEventListener('click', () => {
      this.close();
    });

    return notificationCloseButton;
  }

  protected buildNotificationContent(): HTMLElement {
    const { title } = this.notificationOptions;
    const notificationContent = document.createElement('section');
    notificationContent.classList.add('notific8-content');
    const notificationMessage = document.createElement('span');

    if (title) {
      notificationContent.appendChild(this.buildNotificationHeader());
    }

    notificationMessage.classList.add('notific8-message');
    notificationMessage.innerHTML = this.message;
    notificationContent.appendChild(notificationMessage);

    return notificationContent;
  }

  protected buildNotificationImage(): HTMLElement {
    const { imageUrl, imageAltText } = this.notificationOptions;
    const notificationImage = document.createElement('img');

    notificationImage.classList.add('notific8-image');
    notificationImage.src = imageUrl as string;
    if (imageAltText) {
      notificationImage.alt = imageAltText as string;
    }

    return notificationImage;
  }
}

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
    const { horizontalEdge, verticalEdge } = notificationOptions;
    const containerSelector = `notific8-container[${horizontalEdge}][${verticalEdge}]`;
    (document.querySelector(containerSelector) as HTMLElement).appendChild(notification.notificationHtml);
  }

  function ensureEdgeContainerExists(notificationOptions: Notific8Options): void {
    const { horizontalEdge, verticalEdge } = notificationOptions;
    const containerSelector = `notific8-container[${horizontalEdge}][${verticalEdge}]`;

    if (!document.querySelectorAll(containerSelector).length) {
      const containerElement = document.createElement('notific8-container');
      containerElement.setAttribute(horizontalEdge as string, '');
      containerElement.setAttribute(verticalEdge as string, '');
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
