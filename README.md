# notific8

[![Build Status](https://travis-ci.org/willsteinmetz/notific8.svg?branch=master)](https://travis-ci.org/willsteinmetz/notific8)

Notific8 is a notification JavaScript plug-in. Notific8 has built in themes that each come with a set of built in colors. The plug-in is designed to be easy to create new themes and colors for. The plug-in was born from a want for a simply designed yet modern and stylish notification system that was easily customizable.

As of version 3.0.0, the plug-in was rewritten in pure JavaScript (via CoffeeScript) to be compatible with many of today's JavaScript frameworks that do not play well with jQuery. A jQuery wrapper is also provided to allow existing code to function properly with the new version. The minified version of the jQuery wrapper `jquery.notific8.min.js` has a copy of the notific8 code included so that developers only have to include one file in their project or build script. The unminified files are also available for use in custom build scripts as well.

## Install with Bower

    $ bower install notific8 --save

## Install with NPM

    $ npm install notific8 --save

## Demo page

An interactive demo page can be found in the root directory. It can be launched by running `npm start demo` after installing the node modules required for development.

## Features

* Notifications slide in and out from the upper right corner of the page
* Configurable life span of the notification
* Option to display a heading
* Built in theme options with ability to create custom themes (see CSS for built in themes)
* Ability to make the notification sticky
* Ability to set up custom settings for reuse without having to type them over and over
* Ability to set which corner the notifications are shown in
* Ability to set the z-index
    * Can be set via config/configure or the zindex function
* Ability to customize close text on sticky notifications
* Ability to set custom CSS namespace if necessary
* Events for init, create, and close
* Modular system to make it easier for developers to extend the plug-in
* Ability to add a unique name to notifications or allow the plug-in to generate one
    * All notification names are returned when a notification is shown (when no queue) or queued
* Ability to queue notifications
    * Queued notifications can be removed by name

## Officially Supported modules

* [image](https://github.com/willsteinmetz/notific8-image) - adds the ability to use an image in the notification
* [closeAll](https://github.com/willsteinmetz/notific8-closeall) - adds a "Close All" button to the container if more than one notification is visible
* [icon](https://github.com/willsteinmetz/notific8-icon) [deprecated] - adds the ability to select an icon to display in the notification
    * This module is deprecated. Consider using the image module instead to reduce the size of resources required.

## Browser support

Currently supported and testing:

* Chrome
* Firefox
* Safari (Mac only)
* IE 10+
* Edge

While not tested, this plug-in should work on Opera versions released after the rewrite on the blink rendering engine. As the adoption rate of Windows 10 increases, compatibility with Internet Explorer will be reconsidered periodically.

### Browser version support

As a rule of thumb, only the most recent plus one version older of a browser is supported unless marked otherwise. While it may work in IE8 and IE9, notific8 will not be tested or officially supported in legacy browsers such as versions of IE older than 10.

## Wiki

Please view the [wiki](https://github.com/ralivue/notific8/wiki) for information on:

* The options available and how to implement them
* How to create modules to extend the plug-in

## Future development

All planned features can be viewed by visiting the [issues page](https://github.com/ralivue/notific8/issues).

## Styles

The styles are written in Scss format and available in the `src/sass` directory. Development will continue in Scss only - please do not open issues or pull requests to change the default style format. Contributions containing styles must be in Scss format.

The grunt task `alternate-styles` will create versions of the code in Sass format, Less, and Stylus. These files are not generated automatically.

## Want to help?

Want to file a bug report or contribute some code? That's most awesome! Please view the guidelines for [contributing](http://github.com/willsteinmetz/notific8/blob/master/CONTRIBUTING.md) before opening an issue or pull request.

## License

The notific8 plug-in is released under the BSD license.

(c) 2013-2016 [Will Steinmetz](http://willsteinmetz.net)
