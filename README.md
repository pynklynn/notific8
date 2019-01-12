# notific8

[![Build Status](https://travis-ci.org/willsteinmetz/notific8.svg?branch=master)](https://travis-ci.org/willsteinmetz/notific8)

Notific8 is an on-page notification JavaScript library. Notific8 has built in themes which come with a set of built in colors for each. The library is designed to be easy to create new themes and colors. The library was born from a want for a simply designed yet modern and stylish notification system that was easily customizable and easy to use.

Version 5 included a major rewrite of the library to bring it up to modern standards and make it easier to use with other frameworks and libraries. Other major changes to the library include:

- Updated the code to Typescript including a typing for for using the library in Typescript-based projects
- Updated the testing library to use Jest
- Simplified the build setup

## Install with NPM

    $ npm install notific8 --save

## Demo page

An interactive demo page can be found in the `demo` directory. The demo is written using the Vue library and the source code serves as an example of how to use Notific8 with other libraries and frameworks.

## Features

* Promise-based functionality for more control
* Ability to reuse notification objects
* Notifications slide in and out from the designated corner of the page (default is upper right)
* Configurable life span of the notification
* Option to display a heading
* Built in theme options with ability to create custom themes (see CSS for built in themes)
* Ability to make the notification sticky
* Ability to set up custom settings for reuse without having to type them over and over
* Ability to set which corner the notifications are shown in
* Ability to set the z-index
* Ability to queue notifications
* Ability to add action buttons to notifications

## Browser support

Currently supported and tested:

* Chrome
* Firefox
* Safari (Mac only)
* Edge (Windows desktop only)

While not tested, this library should work on Opera versions released after the swap to Chromium. From version 5 onward, the library no longer supports Internet Explorer and that will not be added.

As a rule of thumb, only the most recent plus one version older of a browser are supported unless marked otherwise.

## Future development

All planned features can be viewed by visiting the [issues page](https://github.com/ralivue/notific8/issues).

## Styles

The styles are written in Scss format and available in the `src/sass` directory. Development will continue in Scss only - please do not open issues or pull requests to change the default style format. Contributions containing styles must be in Scss format.

## Want to help?

Want to file a bug report or contribute some code? That's most awesome! Please view the guidelines for [contributing](http://github.com/willsteinmetz/notific8/blob/master/CONTRIBUTING.md) before opening an issue or pull request.

## Usage

```javascript
import { Notific8 } from 'notific8';

Notific8.create('Test notification').then((notification) => {
    // open the notification
    notification.open().then(() => {
        console.log('Notification has been opened!');
    });
});

// async example
(async() => {
    const notification = await Notific8.create('Test notification');
    await notification.open();
    console.log('Notification has been opened!');
})();
```

### Options

None of the options are required. Default values are available in the library and automatically set if not provided.

#### `actionButtons`: Notific8ActionButton[]

Provides action buttons to the notification. If an action is not provided, the button's action is set to close the notification. The option is an array of Notific8ActionButton interface.

Definition of Notific8ActionButton:

```typescript
interface Notific8ActionButton {
  buttonAction: Function;
  buttonText: string;
}
```

#### `closeHelpText`: string

Help text shown when hovering over the close button.

#### `closeReject`: Function

The close function returns a promise. This option is used for the rejection of the promise when the notification is closed by the timer or clicking the close button.

#### `closeResolve`: Function

The close function returns a promise. This option is used for the resolution of the promise when the notification is closed by the timer or clicking the close button.

#### `horizontalEdge`: 'top'|'bottom'

Horizontal edge of the screen to display the notification against. Valid options are the strings `'top'` and `'bottom'`.

#### `id`: string

Queriable ID given to the notification.

#### `imageAltText`: string

Alternate text on the image provided with the `imageUrl` option. If this is provided but `imageUrl` is not, this option will be ignored.

#### `imageUrl`: string

URL of the image to display on the notification.

#### `life`: number

Life of the notification until it automatically closes. If the `sticky` option is applied, this value is ignored.

#### `queue`: boolean

Whether or not to add the notification to the queue. The first notification sent in with the queue option true will be automatically opened if there are no notifications on the screen.

#### `queueOpenReject`: Function

The open function returns a promise. This option is used for the rejection of the promise when the notification is opened by the queue.

#### `queueOpenResolve`: Function

The open function returns a promise. This option is used for the resolution of the promise when the notification is opened by the queue.

#### `sticky`: boolean

Whether or not the notification should stay open until the user closes it. If the `life` option is passed in with this option, the `life` option will be ignored.

#### `title`: string

Heading to apply to the notification.

#### `theme`: string

Theme to add to the notification for styling. See the themes page for more information.

#### `themeColor`: string

Color of the theme to style the notification. See the themes page for more information.

#### `verticalEdge`: 'left'|'right'

Vertical edge of the screen to display the notification against. Valid options are the strings `'left'` and `'right'`.

#### `zIndex`: number

Z-index for layer to display the notification.

### Notification API

#### `open()`: Promise

Opens the notification object. Returns a promise.

#### `close()`: Promise

Closes the notification object. Returns a promise.

### Notific8 API

#### `getDefaultOptions()`: NotificationOptions

Get the default options set for the library.

#### `setDefaultOptions(newDefaultOptions: Notific8Options)`: void

Set any number of default options at one time by passing in an object that complies with the Notific8Options interface.

#### `setDefaultOption(option: string, newValue: string|number|boolean|Notific8ActionButton[])`: void

Set a specific default option. The passed in option's value must comply with the property in the Notific8Options interface.

#### `isNotific8OptionsObjectValid(optionsToCheck: object)`: boolean

Returns whether or not the passed in notifcation options object is valid.

#### `create(message: string, notificationOptions: Notific8Options = notific8DefaultOptions)`: Promise<Notific8Notification>

Creates a new notification with the passed in notification message and optional notification options object.

#### `queueOrAddToContainer(notification: Notific8Notification)`: void

Determines whether to queue or add the passed in notification to a container.

#### `hasQueuedNotifications()`: boolean

Returns whether or not there are notifications in the queue.

#### `triggerQueue()`: void

Triggers the queue to fire.

## License

The notific8 library is released under the BSD license.

(c) 2013-2019 [Will Steinmetz](http://willsteinmetz.net)
