/**
 * @author Will Steinmetz
 * jQuery notification plug-in inspired by the notification style of Windows 8
 * Copyright (c)2013, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
(function ($) {
    "use strict";

    var settings,
        methods,
        self;

    settings = {
        life: 10000,
        theme: 'teal',
        sticky: false,
        verticalEdge: 'right',
        horizontalEdge: 'top',
        zindex: 1100
    };

    methods = (function () {
        /**
         * Destroy the notification
         * @param object $this
         */
        function destroy($this) {
            var data = $this.data('notific8');

            $(window).unbind('.notific8');
            $this.removeData('notific8');
        }

        /**
         * Build the notification and add it to the screen's stack
         * @param object $this
         */
        function buildNotification($this) {
            var data = $this.data('notific8'),
                notification = $('<div />'),
                num = Number($('body').attr('data-notific8s')),
                close;
            num += 1;

            notification.addClass('jquery-notific8-notification').addClass(data.settings.theme);
            notification.attr('id', 'jquery-notific8-notification-' + num);
            $('body').attr('data-notific8s', num);

            // check for a heading
            if (data.settings.hasOwnProperty('heading') && (typeof data.settings.heading === "string")) {
                notification.append($('<div />').addClass('jquery-notific8-heading').html(data.settings.heading));
            }

            // check if the notification is supposed to be sticky
            if (data.settings.sticky) {
                close = $('<div />').addClass('jquery-notific8-close-sticky').append(
                    $('<span />').html('close x')
                );
                close.on('click', function (event) {
                    notification.animate({width: 'hide'}, {
                        duration: 'fast',
                        complete: function () {
                            notification.remove();
                        }
                    });
                });
                notification.append(close);
                notification.addClass('sticky');
            // otherwise, put the normal close button up that is only display
            // when the notification is hovered over
            } else {
                close = $('<div />').addClass('jquery-notific8-close').append(
                    $('<span />').html('X')
                );
                close.on('click', function (event) {
                    notification.animate({width: 'hide'}, {
                        duration: 'fast',
                        complete: function () {
                            notification.remove();
                        }
                    });
                });
                notification.append(close);
            }

            // add the message
            notification.append($('<div />').addClass('jquery-notific8-message').html(data.message));

            // add the notification to the stack
            $('.jquery-notific8-container.' + data.settings.verticalEdge + '.' + data.settings.horizontalEdge).append(notification);

            // slide the message onto the screen
            notification.animate({width: 'show'}, {
                duration: 'fast',
                complete: function () {
                    if (!data.settings.sticky) {
                        (function (n, l) {
                            setTimeout(function () {
                                n.animate({width: 'hide'}, {
                                    duration: 'fast',
                                    complete: function () {
                                        n.remove();
                                    }
                                });
                            }, l);
                        }(notification, data.settings.life));
                    }
                    data.settings = {};
                }
            });
        }

        /**
         * Set up the configuration settings
         * @param object options
         */
        function configure(options) {
            $.extend(settings, options);
        }

        /**
         * Set up the z-index
         * @param int z
         */
        function zindex(z) {
            settings.zindex = z;
        }

        /**
         * Initialize the plug-in
         * @param string message
         * @param object options
         * @return object
         */
        function init(message, options) {
            return self.each(function () {
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
                buildNotification($this);
            });
        }

        return {
            init: init,
            destroy: destroy,
            configure: configure,
            zindex: zindex
        };
    }());

    /**
     * wrapper since this plug-in is called without selecting an element first
     * @param string message
     * @param object options
     */
    $.notific8 = function (message, options) {
        switch (message) {
        case 'configure':
        case 'config':
            return methods.configure.apply(this, [options]);
        case 'zindex':
            return methods.zindex.apply(this, [options]);
        default:
            if (typeof options === 'undefined') {
                options = {};
            }

            // make sure that the stack containers exist
            if ($('.jquery-notific8-container').size() === 0) {
                var $body = $('body');
                $body.attr('data-notific8s', 0);
                $body.append($('<div />').addClass('jquery-notific8-container').addClass('top').addClass('right'));
                $body.append($('<div />').addClass('jquery-notific8-container').addClass('top').addClass('left'));
                $body.append($('<div />').addClass('jquery-notific8-container').addClass('bottom').addClass('right'));
                $body.append($('<div />').addClass('jquery-notific8-container').addClass('bottom').addClass('left'));
                $('.jquery-notific8-container').css('z-index', settings.zindex);
            }

            // make sure the edge settings exist
            if ((!options.hasOwnProperty('verticalEdge')) || ((options.verticalEdge.toLowerCase() !== 'right') && (options.verticalEdge.toLowerCase() !== 'left'))) {
                options.verticalEdge = settings.verticalEdge;
            }
            if ((!options.hasOwnProperty('horizontalEdge')) || ((options.horizontalEdge.toLowerCase() !== 'top') && (options.horizontalEdge.toLowerCase() !== 'bottom'))) {
                options.horizontalEdge = settings.horizontalEdge;
            }
            options.verticalEdge = options.verticalEdge.toLowerCase();
            options.horizontalEdge = options.horizontalEdge.toLowerCase();

            //display the notification in the right corner
            $('.jquery-notific8-container.' + options.verticalEdge + '.' + options.horizontalEdge).notific8(message, options);
            break;
        }
    };

    /**
     * plugin setup
     */
    $.fn.notific8 = function (message, options) {
        self = this;

        if (typeof message === "string") {
            return methods.init.apply(this, arguments);
        } else {
            $.error('jQuery.notific8 takes a string message as the first parameter');
        }
    };
}(jQuery));
