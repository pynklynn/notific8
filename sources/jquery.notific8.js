/**
 * @author Will Steinmetz
 * @author CAILBAUT Olivier
 *
 * jQuery notification plug-in inspired by the notification style of Windows 8
 *
 * Copyright (c)2013, Will Steinmetz, CAILBAUT Olivier
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
;
(function($) {
    var settings = {
        life: 10000, //lifeTime of the notification
        theme: 'teal', //color theme of the notification
        sticky: false, //notification sticked or not
        verticalEdge: 'right', //notification positionned to left or right
        horizontalEdge: 'top', //notification positionned to top or bottom
        zindex: 1100, //zindex of the notification
        badge: '', //badge url (32px x 32px)
        opacity: 1              //opacity of the notification
    };

    var timeoutHandler;

    var methods = {
        init: function(message, options) {
            return this.each(function() {
                var $this = $(this),
                        data = $this.data('notific8');

                $this.data('notific8', {
                    target: $this,
                    settings: {},
                    message: ""
                });
                data = $this.data('notific8');
                data.message = message;

                // apply the options
                $.extend(data.settings, settings, options);

                // add the notification to the stack
                methods._buildNotification($this);
            });
        },
        /**
         * Destroy the notification
         */
        destroy: function($this) {
            var data = $this.data('notific8');

            $(window).unbind('.notific8');
            $this.removeData('notific8');
        },
        /**
         * Build the notification and add it to the screen's stack
         */
        _buildNotification: function($this) {
            var data = $this.data('notific8'),
                    notification = $('<div />'),
                    num = Number($('body').attr('data-notific8s'));
            num++;

            notification.addClass('jquery-notific8-notification').addClass(data.settings.theme);
            notification.attr('id', 'jquery-notific8-notification-' + num);

            $('body').attr('data-notific8s', num);

            //add a div for texts (heading and message)
            notification.append($('<div />').addClass('jquery-notific8-text'));

            // check for a heading
            if (data.settings.hasOwnProperty('heading') && (typeof data.settings.heading === "string")) {
                notification.children('.jquery-notific8-text').append($('<div />').addClass('jquery-notific8-heading').html(data.settings.heading));
            }

            // check if the notification is supposed to be sticky
            if (data.settings.sticky) {
                var close = $('<div />').addClass('jquery-notific8-close-sticky').append(
                        $('<img />').attr('src', 'img/ui/icon-close.png')
                        );
                close.click(function(event) {
                    methods.closeNotification(notification);
                });
                notification.append(close);
                notification.addClass('sticky');
            }
            // otherwise, put the normal close button up that is only display
            // when the notification is hovered over
            else {
                var close = $('<div />').addClass('jquery-notific8-close');
                close.click(function(event) {
                    methods.closeNotification(notification);
                });
                notification.append(close);
                notification.mousemove(function(event) {
                    clearTimeout($this.timeoutHandler); //clear the fadeout timeout
                    notification.stop();
                    notification.animate({opacity: data.settings.opacity}, {duration: 1}); //show again the notification
                }).mouseenter(function(event) {
                    close.show();                       //show the close button
                }).mouseleave(function(event) {
                    console.log('leave');
                    close.hide();
                    methods._setTimeout(notification, data.settings.life);
                });
                notification.mousedown(function(event) {
                    if (event.which === 1) {
                        notification.addClass('clicked');
                    }
                });
                notification.mouseup(function(event) {                    
                        notification.removeClass('clicked');                    
                });
            }

            // add the message
            notification.children('.jquery-notific8-text').append($('<div />').addClass('jquery-notific8-message').html(data.message));

            //check for a badge, and add it if needded
            if (data.settings.badge !== '' && typeof data.settings.heading === "string") {
                notification.append($('<div />').addClass('badge'));
                notification.children('.badge').append($('<img/>').attr('src', data.settings.badge));
            }

            // add the notification to the stack
            $('.jquery-notific8-container.' + data.settings.verticalEdge + '.' + data.settings.horizontalEdge).append(notification);

            // slide the message onto the screen
            notification.animate({width: 'show'}, {
                duration: 'fast',
                complete: function() {
                    if (!data.settings.sticky) {
                        methods._setTimeout(notification, data.settings.life);
                    }
                    //data.settings = {};
                }
            });
        },
        /**
         *
         * @param {notification} n
         * @param {number} l life time
         * @returns {undefined}
         */
        _setTimeout: function(n, l) {
            timeoutHandler = setTimeout(function() {
                methods.fadeOutNotification(n);
            }, l);
        },
        /**
         * Fade out a notification when it disapear automaticaly
         * @param {notification} n
         */
        fadeOutNotification: function(n) {
            n.animate({opacity: 0}, {
                duration: 4000,
                complete: function() {
                    methods.slideNotifications(n);
                }
            });
        },
        /**
         * close a notification (width and opacity to 0) and then call the method to slide the other ones
         * @param {notification} n
         */
        closeNotification: function(n) {
            //hide the notifications
            n.animate({width: '0', opacity: 0}, {
                duration: 'slow',
                complete: function() {
                    //slide the other notifications
                    methods.slideNotifications(n);
                }
            });
        },
        /**
         * Slide the other notifications after the closed one
         * @param {notification} n
         */
        slideNotifications: function(n) {
            n.animate({height: 0, padding: 0, margin: 0, border: 0}, {
                duration: 'slow',
                complete: function() {
                    n.remove(); //completly delete the notification
                }
            });
        },
        /**
         * Set up the configuration settings
         */
        configure: function(options) {
            $.extend(settings, options);
        },
        /**
         * Set up the z-index
         * @param {!number} zindex zIndex of the notification
         */
        zindex: function(zindex) {
            settings.zindex = zindex;
        }
    };

    // wrapper since this plug-in is called without selecting an item first
    $.notific8 = function(message, options) {
        switch (message) {
            case 'configure':
            case 'config':
                return methods.configure.apply(this, [options]);
                break;
            case 'zindex':
                return methods.zindex.apply(this, [options]);
                break;
            default:
                if (typeof options === 'undefined') {
                    options = {};
                }

                // make sure that the stack containers exist
                if ($('.jquery-notific8-container').size() === 0) {
                    $('body').attr('data-notific8s', 0);
                    $('body').append($('<div />').addClass('jquery-notific8-container').addClass('top').addClass('right'));
                    $('body').append($('<div />').addClass('jquery-notific8-container').addClass('top').addClass('left'));
                    $('body').append($('<div />').addClass('jquery-notific8-container').addClass('bottom').addClass('right'));
                    $('body').append($('<div />').addClass('jquery-notific8-container').addClass('bottom').addClass('left'));
                    $('.jquery-notific8-container').css('z-index', settings.zindex);
                }

                // make sure the edge settings exist
                if ((!options.hasOwnProperty('verticalEdge')) || ((options.verticalEdge.toLowerCase() !== 'right') && (options.verticalEdge.toLowerCase() !== 'left'))) {
                    options.verticalEdge = 'right';
                }
                if ((!options.hasOwnProperty('horizontalEdge')) || ((options.horizontalEdge.toLowerCase() !== 'top') && (options.horizontalEdge.toLowerCase() !== 'bottom'))) {
                    options.horizontalEdge = 'top';
                }
                options.verticalEdge = options.verticalEdge.toLowerCase();
                options.horizontalEdge = options.horizontalEdge.toLowerCase();

                //display the notification in the right corner
                $('.jquery-notific8-container.' + options.verticalEdge + '.' + options.horizontalEdge).notific8(message, options);
                break;
        }
    };

    // plugin setup
    $.fn.notific8 = function(message, options) {
        if (typeof message === "string") {
            return methods.init.apply(this, arguments);
        } else {
            $.error('jQuery.notific8 takes a string message as the first parameter');
        }
    };
})(jQuery);
