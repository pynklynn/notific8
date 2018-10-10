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
  styleNamespace?: string;
  title?: string;
  theme?: string;
  themeColor?: string;
  verticalEdge?: 'left'|'right';
  zIndex?: number;
  [key: string]: string|number|boolean|Function|undefined;
}

export class Notific8Notification {
  private closeTimeout?: number;
  public notificationHtml!: HTMLElement;

  constructor(public message: string, public notificationOptions: Notific8Options) {
    this.buildNotificationHtml();
  }

  public open(): Promise<void> {
    const { life, sticky, styleNamespace } = this.notificationOptions;

    return new Promise<void>((resolve, reject) => {
      try {
        const openClass = `${styleNamespace}-open`;
        this.notificationHtml.classList.add(openClass);

        if (!sticky) {
          let { closeReject, closeResolve } = this.notificationOptions;
          closeReject = closeReject || function() {};
          closeResolve = closeResolve || function(e: any) {};

          this.closeTimeout = setTimeout(() => {
            this.close().then(() => {
              (closeResolve as Function)();
            }).catch((e) => {
              (closeReject as Function)(e);
            });
          }, life);
        }

        resolve();
      } catch(e) {
        reject();
      }
    });
  }

  public close(): Promise<void> {
    const { styleNamespace } = this.notificationOptions;
    const openClass = `${styleNamespace}-open`;

    return new Promise<void>((resolve, reject) => {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
      try {
        this.notificationHtml.classList.remove(openClass);
        resolve();
      } catch(e) {
        reject(e);
      }
    });
  }

  protected buildNotificationHtml(): void {
    const { theme, themeColor, styleNamespace, zIndex } = this.notificationOptions;

    this.notificationHtml = document.createElement(`${styleNamespace}-notification`);
    this.notificationHtml.classList.add(theme as string, themeColor as string);
    this.notificationHtml.style.zIndex = (zIndex as number).toString();
    this.buildNotificationId();
    this.notificationHtml.appendChild(this.buildNotificationHeader());
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

  /**
   * Solution found as an answer on StackOverflow:
   * http://stackoverflow.com/a/2117523/5870787
   */
  protected generateUniqueId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r, v;
      r = Math.random() * 16 | 0;
      v = c === 'x' ? r : r & 0x3 | 0x8;

      return v.toString(16);
    });
  }

  protected buildNotificationHeader(): HTMLElement {
    const { styleNamespace, title } = this.notificationOptions;
    const notificationHeader = document.createElement('header');

    notificationHeader.classList.add(`${styleNamespace}-header`);
    if (title) {
      notificationHeader.appendChild(this.buildNotificationTitle());
    }
    notificationHeader.appendChild(this.buildNotificationCloseButton());

    return notificationHeader;
  }

  protected buildNotificationTitle(): HTMLElement {
    const { title, styleNamespace } = this.notificationOptions;
    const notificationTitle = document.createElement('span');
    
    notificationTitle.classList.add(`${styleNamespace}-title`);
    notificationTitle.innerText = title as string;

    return notificationTitle;
  }

  protected buildNotificationCloseButton(): HTMLElement {
    const { styleNamespace, closeHelpText } = this.notificationOptions;
    const notificationCloseButton = document.createElement('span');
    notificationCloseButton.classList.add(`${styleNamespace}-close-button`);
    notificationCloseButton.title = closeHelpText as string;
    notificationCloseButton.innerHTML = '&times;';

    return notificationCloseButton;
  }

  protected buildNotificationContent(): HTMLElement {
    const { styleNamespace, imageUrl } = this.notificationOptions;
    const notificationContent = document.createElement('section');
    const notificationMessage = document.createElement('span');

    const contentClasses = [ `${styleNamespace}-content` ];
    if (imageUrl) {
      contentClasses.push(`${styleNamespace}-has-image`);
      notificationContent.appendChild(this.buildNotificationImage());
    }
    notificationContent.classList.add(...contentClasses);
    notificationMessage.classList.add(`${styleNamespace}-message`);
    notificationMessage.innerHTML = this.message;
    notificationContent.appendChild(notificationMessage);

    return notificationContent;
  }

  protected buildNotificationImage(): HTMLElement {
    const { styleNamespace, imageUrl, imageAltText } = this.notificationOptions;
    const notificationImage = document.createElement('img');

    notificationImage.classList.add(`${styleNamespace}-image`);
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
