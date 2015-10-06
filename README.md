# notific8

Notific8 is a notification plug-in that was originally inspired by the notifications introduced in Windows 8 with some web ready restyling and customizations. Notific8 has built in themes (colors) and theme families (styles) and is easy to create new themes and theme families for. The plug-in was born from a want for a simply designed yet modern and stylish notification system. The plug-in is also designed to scale based on the page's font-size setting (it was designed for the default of 100%/16px as the default).

## Install with Bower

    $ bower install notific8 --save

## Install with NPM

    $ npm install notific8 --save

## Demo page

An interactive demo page can be found in the ./demo/ directory.

## Features

* Notifications slide in and out from the upper right corner of the page
* Configurable life span of the notification
* Option to display a heading
* Option to pick an icon from the including icon font
* Built in theme options with ability to create custom themes (see CSS for built in themes)
* Ability to make the notification sticky
* Ability to set up custom settings for reuse without having to type them over and over
* Ability to set which corner the notifications are shown in
* Ability to set the z-index
    * Can be set via config/configure or the zindex function
* Ability to customize close text on sticky notifications
* Ability to set custom CSS namespace if necessary
* Events for init, create, and close

## Browser support

Currently supported and testing:

* Chrome
* Firefox
* Safari (Mac only)
* IE 10+
* Edge

While not tested, this plug-in should work on Opera versions released after the rewrite on the blink rendering engine.

### Browser version support

As a rule of thumb, only the most recent plus one version older of a browser is supported unless marked otherwise. While it may work in IE8 and IE9, notific8 will not be tested or officially supported in legacy browsers such as versions of IE older than 10.

## Wiki

Please view the [https://github.com/ralivue/notific8/wiki](wiki) for information on the options available and how to implement them.

## Future development

* Convert the code to be a regular JavaScript plug-in with a jQuery wrapper for use on more pages
* Add the ability to use a custom image instead of one of the built in icons

## License

The jQuery notific8 plug-in is released under the BSD license.

(c) 2013-2015 [Ralivue](http://ralivue.com)
