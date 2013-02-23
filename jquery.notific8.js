/**
 * @author Will Steinmetz
 * 
 * jQuery notification plug-in inspired by the notification style of Windows 8
 * 
 * Copyright (c)2013, Will Steinmetz
 * Licensed under the BSD license.
 * http://opensource.org/licenses/BSD-3-Clause
 */
; (function ($) {
	var settings = {
		life: 10000
	};
	
	var methods = {
		init: function(message, options) {
			return this.each(function() {
				var $this = $(this),
					data = $this.data('notific8');
					
				if (!data) {
					$this.data('notific8', {
						target: $this,
						settings: {},
						message: message
					});
					data = $this.data('notific8');
				}
				
				// apply the options
				$.extend(data.settings, settings, options);
				
				// add the notification to the stack
				methods._buildNotification($this);
			});
		},
		
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
				notification = $('<div />');
			
			notification.addClass('jquery-notific8-notification');
			notification.attr('id', 'jquery-notific8-notification-' + $this.find('.jquery-notific8-notification').size().toString());
			
			// check for a heading
			if (data.settings.hasOwnProperty('heading') && (typeof data.settings.heading == "string")) {
				notification.append($('<div />').addClass('jquery-notific8-heading').html(data.settings.heading));
			}
			
			// add the message
			notification.append($('<div />').addClass('jquery-notific8-message').html(data.message));
			
			// add the notification to the stack
			$('#jquery-notific8-container').append(notification);
			
			// slide the message onto the screen
			/*notification.animate({marginRight: 0}, {
				duration: 1000,
				queue: false,
				complete: function() {
					setTimeout(function() {
						notification.animate({marginRight: '-25em'}, {
							duration: 1000,
							queue: false,
							complete: function() {
								notification.remove();
							}
						});
					}, data.settings.life);
				}
			});*/
			// temp - fade the notification instead of slide for now
			notification.fadeIn(500, function() {
			    setTimeout(function() {
                    notification.fadeOut(500, function() {
                        notification.remove();
                    });
                }, data.settings.life);
                data.settings = {};
            });
            // END temp
		}
	};
	
	// wrapper since this plug-in is called without selecting an item first
	$.notific8 = function(message, options) {
		if (typeof options == undefined) {
		    options = {};
        }
		if ($('#jquery-notific8-container').size() === 0) {
			$('body').append($('<div />').attr('id', 'jquery-notific8-container'));
		}
		$('#jquery-notific8-container').notific8(message, options);
	};
	
	// plugin setup
	$.fn.notific8 = function(message, options) {
		if (typeof message == "string") {
			return methods.init.apply(this, arguments);
		} else {
			$.error('jQuery.notific8 takes a string message as the first parameter');
		}
	};
})(jQuery);
