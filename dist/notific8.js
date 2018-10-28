export class Notific8Notification {
    constructor(message, notificationOptions) {
        this.message = message;
        this.notificationOptions = notificationOptions;
        this.buildNotificationHtml();
    }
    open() {
        const { life, sticky, styleNamespace } = this.notificationOptions;
        return new Promise((resolve, reject) => {
            try {
                const openClass = `${styleNamespace}-open`;
                this.notificationHtml.classList.add(openClass);
                if (!sticky) {
                    let { closeReject, closeResolve } = this.notificationOptions;
                    closeReject = closeReject || function () { };
                    closeResolve = closeResolve || function () { };
                    this.closeTimeout = setTimeout(() => {
                        this.close().then(() => {
                            closeResolve();
                        }).catch((e) => {
                            closeReject(e);
                        });
                    }, life);
                }
                resolve();
            }
            catch (e) {
                reject();
            }
        });
    }
    close() {
        const { styleNamespace } = this.notificationOptions;
        const openClass = `${styleNamespace}-open`;
        return new Promise((resolve, reject) => {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
            }
            try {
                this.notificationHtml.classList.remove(openClass);
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }
    buildNotificationHtml() {
        const { theme, themeColor, styleNamespace, zIndex } = this.notificationOptions;
        this.notificationHtml = document.createElement(`${styleNamespace}-notification`);
        this.notificationHtml.classList.add(theme, themeColor);
        this.notificationHtml.style.zIndex = zIndex.toString();
        this.buildNotificationId();
        this.notificationHtml.appendChild(this.buildNotificationHeader());
        this.notificationHtml.appendChild(this.buildNotificationContent());
    }
    buildNotificationId() {
        const { id } = this.notificationOptions;
        if (id) {
            this.notificationHtml.id = id;
        }
        else {
            this.notificationHtml.id = this.generateUniqueId();
        }
    }
    // Solution found as an answer on StackOverflow:
    // http://stackoverflow.com/a/2117523/5870787
    generateUniqueId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r, v;
            r = Math.random() * 16 | 0;
            v = c === 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }
    buildNotificationHeader() {
        const { styleNamespace, title } = this.notificationOptions;
        const notificationHeader = document.createElement('header');
        notificationHeader.classList.add(`${styleNamespace}-header`);
        if (title) {
            notificationHeader.appendChild(this.buildNotificationTitle());
        }
        notificationHeader.appendChild(this.buildNotificationCloseButton());
        return notificationHeader;
    }
    buildNotificationTitle() {
        const { title, styleNamespace } = this.notificationOptions;
        const notificationTitle = document.createElement('span');
        notificationTitle.classList.add(`${styleNamespace}-title`);
        notificationTitle.innerText = title;
        return notificationTitle;
    }
    buildNotificationCloseButton() {
        const { styleNamespace, closeHelpText } = this.notificationOptions;
        const notificationCloseButton = document.createElement('span');
        notificationCloseButton.classList.add(`${styleNamespace}-close-button`);
        notificationCloseButton.title = closeHelpText;
        notificationCloseButton.innerHTML = '&times;';
        return notificationCloseButton;
    }
    buildNotificationContent() {
        const { styleNamespace, imageUrl } = this.notificationOptions;
        const notificationContent = document.createElement('section');
        const notificationMessage = document.createElement('span');
        const contentClasses = [`${styleNamespace}-content`];
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
    buildNotificationImage() {
        const { styleNamespace, imageUrl, imageAltText } = this.notificationOptions;
        const notificationImage = document.createElement('img');
        notificationImage.classList.add(`${styleNamespace}-image`);
        notificationImage.src = imageUrl;
        if (imageAltText) {
            notificationImage.alt = imageAltText;
        }
        return notificationImage;
    }
}
export var Notific8;
(function (Notific8) {
    let notific8DefaultOptions;
    resetDefaultOptions();
    function resetDefaultOptions() {
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
    Notific8.resetDefaultOptions = resetDefaultOptions;
    function getDefaultOptions() {
        return notific8DefaultOptions;
    }
    Notific8.getDefaultOptions = getDefaultOptions;
    function setDefaultOptions(newDefaultOptions) {
        validateOptionsObject(newDefaultOptions);
        notific8DefaultOptions = Object.assign(notific8DefaultOptions, newDefaultOptions);
    }
    Notific8.setDefaultOptions = setDefaultOptions;
    function setDefaultOption(option, newValue) {
        if (!Notific8.isNotific8OptionsObjectValid({ option })) {
            throw new TypeError(`"${option}" is not a valid Notific8 option property`);
        }
        notific8DefaultOptions[option] = newValue;
    }
    Notific8.setDefaultOption = setDefaultOption;
    function isNotific8OptionsObjectValid(optionsToCheck) {
        const defaultOptionsKeys = new Set(Object.keys(notific8DefaultOptions));
        const optionsToCheckKeys = new Set(Object.keys(optionsToCheck));
        const keysIntersection = new Set([...Array.from(optionsToCheckKeys)].filter((key) => defaultOptionsKeys.has(key)));
        return keysIntersection.size === optionsToCheckKeys.size;
    }
    Notific8.isNotific8OptionsObjectValid = isNotific8OptionsObjectValid;
    function create(message, notificationOptions = notific8DefaultOptions) {
        return new Promise(((resolve, reject) => {
            try {
                notificationOptions = Object.assign({}, notific8DefaultOptions, notificationOptions);
                validateOptionsObject(notificationOptions);
                ensureEdgeContainerExists(notificationOptions);
                const notification = new Notific8Notification(message, notificationOptions);
                // @TODO check for and handle queue
                addNotificationToContainer(notificationOptions, notification);
                resolve(notification);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    Notific8.create = create;
    function addNotificationToContainer(notificationOptions, notification) {
        const { horizontalEdge, verticalEdge, styleNamespace } = notificationOptions;
        const containerSelector = `.${styleNamespace}-container.${horizontalEdge}.${verticalEdge}`;
        document.querySelector(containerSelector).appendChild(notification.notificationHtml);
    }
    function ensureEdgeContainerExists(notificationOptions) {
        const { horizontalEdge, verticalEdge, styleNamespace } = notificationOptions;
        const containerSelector = `.${styleNamespace}-container.${horizontalEdge}.${verticalEdge}`;
        if (!document.querySelectorAll(containerSelector).length) {
            const containerElement = document.createElement('aside');
            containerElement.classList.add(`${styleNamespace}-container`, horizontalEdge, verticalEdge);
            document.body.appendChild(containerElement);
        }
    }
    function validateOptionsObject(notific8Options) {
        if (!Notific8.isNotific8OptionsObjectValid(notific8Options)) {
            throw new TypeError('Invalid properties passed in as part of the options');
        }
        return true;
    }
})(Notific8 || (Notific8 = {}));
