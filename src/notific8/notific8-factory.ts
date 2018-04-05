import { Notific8Options } from './notific8-options';

export namespace Notific8Factory {
  let notific8DefaultOptions: Notific8Options;
  resetDefaultOptions();

  export function resetDefaultOptions(): void {
    notific8DefaultOptions = {
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
  }

  export function getDefaultOptions(): Notific8Options {
    return notific8DefaultOptions;
  }

  export function setDefaultOptions(newDefaultOptions: Notific8Options): void {
    if (!Notific8Factory.isNotific8OptionsObjectValid(newDefaultOptions)) {
      throw new TypeError('Invalid properties passed in as part of the options');
    }

    notific8DefaultOptions = Object.assign(notific8DefaultOptions, newDefaultOptions);
  }

  export function setDefaultOption(option: string, newValue: string|number|boolean): void {
    if (!Notific8Factory.isNotific8OptionsObjectValid({ option })) {
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

  export function create(message: string, notificationOptions?: Notific8Options) {
    // @todo create notification and return it
  }
}
