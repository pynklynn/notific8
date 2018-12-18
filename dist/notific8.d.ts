export interface Notific8Options {
    actionButtons?: Notific8ActionButton[];
    closeHelpText?: string;
    closeReject?: Function;
    closeResolve?: Function;
    horizontalEdge?: 'top' | 'bottom';
    id?: string;
    imageAltText?: string;
    imageUrl?: string;
    life?: number;
    queue?: boolean;
    queueOpenReject?: Function;
    queueOpenResolve?: Function;
    sticky?: boolean;
    title?: string;
    theme?: string;
    themeColor?: string;
    verticalEdge?: 'left' | 'right';
    zIndex?: number;
    [key: string]: string | number | boolean | Function | Notific8ActionButton[] | undefined;
}
export interface Notific8ActionButton {
    buttonAction?: Function;
    buttonText: string;
}
export declare class Notific8Notification {
    message: string;
    notificationOptions: Notific8Options;
    private closeTimeout?;
    notificationHtml: HTMLElement;
    constructor(message: string, notificationOptions: Notific8Options);
    open(): Promise<void>;
    close(): Promise<void>;
    protected remove(): void;
    protected buildNotificationHtml(): void;
    protected buildNotificationId(): void;
    protected generateUniqueId(): string;
    protected buildNotificationHeader(): HTMLElement;
    protected buildNotificationTitle(): HTMLElement;
    protected buildNotificationCloseButton(): HTMLElement;
    protected buildNotificationContent(): HTMLElement;
    protected buildNotificationImage(): HTMLElement;
    protected buildNotificationActionButtons(): HTMLElement;
}
export declare namespace Notific8 {
    function resetDefaultOptions(): void;
    function getDefaultOptions(): Notific8Options;
    function setDefaultOptions(newDefaultOptions: Notific8Options): void;
    function setDefaultOption(option: string, newValue: string | number | boolean): void;
    function isNotific8OptionsObjectValid(optionsToCheck: object): boolean;
    function create(message: string, notificationOptions?: Notific8Options): Promise<Notific8Notification>;
    function queueOrAddToContainer(notification: Notific8Notification): void;
    function hasQueuedNotifications(): boolean;
    function triggerQueue(): void;
}
