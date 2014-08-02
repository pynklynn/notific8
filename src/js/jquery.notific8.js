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
                num = Number($('body').data('notific8s')),
                close,
                animate = 'margin-' + data.settings.verticalEdge,
                styles = {},
                $container = $('.jquery-notific8-container.' + data.settings.verticalEdge + '.' + data.settings.horizontalEdge);

            num += 1;

            notification.addClass('jquery-notific8-notification').addClass(data.settings.theme);
            notification.attr('id', 'jquery-notific8-notification-' + num);
            $('body').data('notific8s', num);

            // check for a heading
            if (data.settings.hasOwnProperty('heading') && (typeof data.settings.heading === "string")) {
                notification.append($('<div />').addClass('jquery-notific8-heading').html(data.settings.heading));
            }

            // check if the notification is supposed to be sticky
            close = $('<div />').append('<span />');
            if (data.settings.sticky) {
                close.addClass('jquery-notific8-close-sticky').find('span').html('close x');
                notification.addClass('sticky');
            } else {
                close.addClass('jquery-notific8-close').find('span').html('X');
            }
            close.on('click', function (event) {
                styles[animate] = -345;
                notification.animate(styles, {
                    duration: 'fast',
                    complete: function () {
                        notification.remove();
                    }
                });
            });
            notification.append(close);

            // add the message
            notification.append($('<div />').addClass('jquery-notific8-message').html(data.message));

            // add the notification to the stack
            $container.append(notification);

            // slide the message onto the screen
            styles[animate] = 0;
            notification.animate(styles, {
                duration: 'fast',
                complete: function () {
                    styles[animate] = -345;
                    styles['height'] = 0;
                    if (!data.settings.sticky) {
                        (function (n, l) {
                            setTimeout(function () {
                                n.animate(styles, {
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

        /**
         * Initialize the containers for the plug-in
         */
        function initContainers() {
            var $body = $('body');
            $body.data('notific8s', 0);
            $body.append($('<div class="jquery-notific8-container top right"></div>'));
            $body.append($('<div class="jquery-notific8-container top left"></div>'));
            $body.append($('<div class="jquery-notific8-container bottom right"></div>'));
            $body.append($('<div class="jquery-notific8-container bottom left"></div>'));
            $('.jquery-notific8-container').css('z-index', settings.zindex);
        }

        /**
         * Make sure that the edge options are ok
         * @param object options
         */
        function checkEdges(options) {
            options.verticalEdge = options.verticalEdge.toLowerCase() || settings.verticalEdge;
            options.horizontalEdge = options.horizontalEdge.toLowerCase() || settings.horizontalEdge;

            if ((options.verticalEdge !== 'right') && (options.verticalEdge !== 'left')) {
                options.verticalEdge = settings.verticalEdge;
            }
            if ((options.horizontalEdge !== 'top') && (options.horizontalEdge !== 'bottom')) {
                options.horizontalEdge = settings.horizontalEdge;
            }
        }

        return {
            init:           init,
            destroy:        destroy,
            configure:      configure,
            zindex:         zindex,
            initContainers: initContainers,
            checkEdges:     checkEdges
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
                methods.initContainers();
            }

            // make sure the edge settings exist
            methods.checkEdges(options);

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
