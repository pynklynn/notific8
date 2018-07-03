import { Notific8Options } from './notific8-options';

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