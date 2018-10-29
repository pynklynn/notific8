export class Notific8Notification {
    constructor(message, notificationOptions) {
        this.message = message;
        this.notificationOptions = notificationOptions;
        this.buildNotificationHtml();
    }
    open() {
        const { life, sticky } = this.notificationOptions;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    this.notificationHtml.setAttribute('open', '');
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
                    else {
                        this.notificationHtml.setAttribute('sticky', '');
                    }
                    resolve();
                }
                catch (e) {
                    reject();
                }
            }, 5);
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this.closeTimeout) {
                clearTimeout(this.closeTimeout);
            }
            try {
                this.notificationHtml.removeAttribute('open');
                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }
    buildNotificationHtml() {
        const { theme, themeColor, zIndex } = this.notificationOptions;
        this.notificationHtml = document.createElement('notific8-notification');
        this.notificationHtml.classList.add(theme, themeColor);
        this.notificationHtml.style.zIndex = zIndex.toString();
        this.buildNotificationId();
        this.notificationHtml.appendChild(this.buildNotificationCloseButton());
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
        const { title } = this.notificationOptions;
        const notificationHeader = document.createElement('header');
        notificationHeader.classList.add('notific8-header');
        if (title) {
            notificationHeader.appendChild(this.buildNotificationTitle());
        }
        // notificationHeader.appendChild(this.buildNotificationCloseButton());
        return notificationHeader;
    }
    buildNotificationTitle() {
        const { title } = this.notificationOptions;
        const notificationTitle = document.createElement('span');
        notificationTitle.classList.add('notific8-title');
        notificationTitle.innerText = title;
        return notificationTitle;
    }
    buildNotificationCloseButton() {
        const { closeHelpText } = this.notificationOptions;
        const notificationCloseButton = document.createElement('span');
        notificationCloseButton.classList.add('notific8-close-button');
        notificationCloseButton.title = closeHelpText;
        notificationCloseButton.innerHTML = '&times;';
        return notificationCloseButton;
    }
    buildNotificationContent() {
        const { imageUrl } = this.notificationOptions;
        const notificationContent = document.createElement('section');
        const notificationMessage = document.createElement('span');
        const contentClasses = ['notific8-content'];
        if (imageUrl) {
            contentClasses.push('notific8-has-image');
            notificationContent.appendChild(this.buildNotificationImage());
        }
        notificationContent.classList.add(...contentClasses);
        notificationMessage.classList.add('notific8-message');
        notificationMessage.innerHTML = this.message;
        notificationContent.appendChild(notificationMessage);
        return notificationContent;
    }
    buildNotificationImage() {
        const { imageUrl, imageAltText } = this.notificationOptions;
        const notificationImage = document.createElement('img');
        notificationImage.classList.add('notific8-image');
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
        const { horizontalEdge, verticalEdge } = notificationOptions;
        const containerSelector = `notific8-container[${horizontalEdge}][${verticalEdge}]`;
        document.querySelector(containerSelector).appendChild(notification.notificationHtml);
    }
    function ensureEdgeContainerExists(notificationOptions) {
        const { horizontalEdge, verticalEdge } = notificationOptions;
        const containerSelector = `notific8-container[${horizontalEdge}][${verticalEdge}]`;
        if (!document.querySelectorAll(containerSelector).length) {
            const containerElement = document.createElement('notific8-container');
            containerElement.setAttribute(horizontalEdge, '');
            containerElement.setAttribute(verticalEdge, '');
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
