# jquery-notific8

jQuery notification plug-in inspired by the notifications introduced in Windows 8

## Initial features
* Notifications fade in and out in upper right corner of the page

## Usage
    $.notific8('My notification message goes here.');
    // with a life set
    $.notific8('My notification message has a life span.', {life: 5000});
    // with a heading
    $.notific8('My notification has a heading line.', {heading: 'Notification Heading'});
    // all options set
    $.notific8('My notification with all options.', {
      life: 5000,
      heading: 'Notification Heading'
    });


## Options
* life: number of milliseconds that the notification will be visible (10000)
* heading: short heading for the notification
