# jquery-notific8

jQuery notification plug-in inspired by the notifications introduced in Windows 8

## Features

* Notifications fade in and out in upper right corner of the page
* Configurable life span of the notification
* Option to display a heading
* Theme options (see CSS for built in themes)

## Usage

    // basic
    $.notific8('My notification message goes here.');
    // with a life set
    $.notific8('My notification message has a life span.', {life: 5000});
    // with a heading
    $.notific8('My notification has a heading line.', {heading: 'Notification Heading'});
    // with a theme
    $.notific8('My notification has a theme.', {theme: 'amethyst'});
    // all options set
    $.notific8('My notification with all options.', {
      life: 5000,
      heading: 'Notification Heading',
      theme: 'amethyst'
    });


## Options

* life: number of milliseconds that the notification will be visible (default: 10000)
* heading: short heading for the notification
* theme: string for the theme (default: 'teal')
    * Custom themes should be named .jquery-notific8-notification.[theme name] in your stylesheet

## Future plans

* Make the notifications slide in and out of an edge of the screen
* Ability to set an icon for the notification
* Ability to make a notification sticky
