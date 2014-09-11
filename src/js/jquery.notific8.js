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
        self,
        supports;

    settings = {
        life: 10000,
        theme: 'teal',
        sticky: false,
        verticalEdge: 'right',
        horizontalEdge: 'top',
        zindex: 1100,
        icon: false
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

            notification.addClass('jquery-notific8-notification ' + data.settings.theme);
            notification.attr('id', 'jquery-notific8-notification-' + num);
            $('body').data('notific8s', num);

            // check for an icon
            if (data.settings.hasOwnProperty('icon') && (typeof data.settings.icon === "string")) {
                notification.addClass('has-icon');
                notification.append('<i class="jquery-notific8-icon notific8-fontastic-' + data.settings.icon + '"></i>');
            }

            // check for a heading
            if (data.settings.hasOwnProperty('heading') && (typeof data.settings.heading === "string")) {
                notification.append($('<div class="jquery-notific8-heading"></div>').html(data.settings.heading));
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
                closeNotification(notification, styles, animate);
            });
            notification.append(close);

            // add the message
            notification.append($('<div class="jquery-notific8-message"></div>').html(data.message));

            // add the notification to the stack
            $container.append(notification);

            // slide the message onto the screen
            if (supports.transition) {
                setTimeout(function () {
                    notification.addClass('open');
                    if (!data.settings.sticky) {
                        (function (n, l) {
                            setTimeout(function () {
                                closeNotification(n);
                            }, l);
                        }(notification, Number(data.settings.life) + 200));
                    }
                }, 5);
            } else {
                styles[animate] = 0;
                notification.animate(styles, {
                    duration: 'fast',
                    complete: function () {
                        if (!data.settings.sticky) {
                            (function (n, l) {
                                setTimeout(function () {
                                    closeNotification(n, styles, animate);
                                }, l);
                            }(notification, data.settings.life));
                        }
                        data.settings = {};
                    }
                });
            }
        }

        /**
         * Close the given notification
         * @param object n
         * @param object styles
         * @param animate
         */
        function closeNotification(n, styles, animate) {
            if (supports.transition) {
                n.removeClass('open');
                n.height(0);
                setTimeout(function () {
                    n.remove();
                }, 200);
            } else {
                styles[animate] = n.outerWidth() * -1;
                styles.height = 0;
                n.animate(styles, {
                    duration: 'fast',
                    complete: function () {
                        n.remove();
                    }
                });
            }
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

        /**
         * Determine support for CSS3 property
         * @param string prop
         */
        function css3Support(prop) {
            var p = prop.split('-'),
                pStr = '',
                i,
                len,
                s = document.createElement('p').style,
                capitalize,
                pNoPrefix;

            capitalize = function (l) {
                return l.charAt(0).toUpperCase() + l.slice(1);
            };

            for (i = 0, len = p.length; i < len; i = i + 1) {
                pStr = pStr + p[i].toLowerCase().replace(/\b\w{3,}/g, capitalize);
            }

            pNoPrefix = pStr.charAt(0).toLowerCase() + pStr.slice(1);

            supports[prop] = s.hasOwnProperty(pNoPrefix) ||
                s.hasOwnProperty('Webkit' + pStr) ||
                s.hasOwnProperty('Moz' + pStr) ||
                s.hasOwnProperty('ms' + pStr) ||
                s.hasOwnProperty('O' + pStr);
        }

        return {
            init:           init,
            destroy:        destroy,
            configure:      configure,
            zindex:         zindex,
            initContainers: initContainers,
            checkEdges:     checkEdges,
            css3Support:    css3Support
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

        if (typeof supports === 'undefined') {
            supports = {};
            methods.css3Support('transition');
        }

        if (typeof message === "string") {
            return methods.init.apply(this, arguments);
        } else {
            $.error('jQuery.notific8 takes a string message as the first parameter');
        }
    };
}(jQuery));
