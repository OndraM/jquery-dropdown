/*
 * jQuery dropdown: A simple dropdown plugin
 *
 * Inspired by Bootstrap: http://twitter.github.com/bootstrap/javascript.html#dropdowns
 *
 * Copyright 2013 Cory LaViska for A Beautiful Site, LLC. (http://abeautifulsite.net/)
 *
 * Dual licensed under the MIT / GPL Version 2 licenses
 *
*/
if(jQuery) (function($) {

	$.extend($.fn, {
		jqdropdown: function(method, data) {

			switch( method ) {
				case 'hide':
					hide();
					return $(this);
				case 'attach':
					return $(this).attr('data-jqdropdown', data);
				case 'detach':
					hide();
					return $(this).removeAttr('data-jqdropdown');
				case 'disable':
					return $(this).addClass('jqdropdown-disabled');
				case 'enable':
					hide();
					return $(this).removeClass('jqdropdown-disabled');
			}

		}
	});

	function show(event) {

		var trigger = $(this),
			jqdropdown = $(trigger.attr('data-jqdropdown')),
			isOpen = trigger.hasClass('jqdropdown-open');

		// In some cases we don't want to show it
		if( trigger !== event.target && $(event.target).hasClass('jqdropdown-ignore') ) return;

		event.preventDefault();
		event.stopPropagation();
		hide();

		if( isOpen || trigger.hasClass('jqdropdown-disabled') ) return;

		// Show it
		trigger.addClass('jqdropdown-open');
		jqdropdown
			.data('jqdropdown-trigger', trigger)
			.show();

		// Position it
		position();

		// Trigger the show callback
		jqdropdown
			.trigger('show', {
				jqdropdown: jqdropdown,
				trigger: trigger
			});

	}

	function hide(event) {

		// In some cases we don't hide them
		var targetGroup = event ? $(event.target).parents().andSelf() : null;

		// Are we clicking anywhere in a dropdown?
		if( targetGroup && targetGroup.is('.jqdropdown') ) {
			// Is it a dropdown menu?
			if( targetGroup.is('.jqdropdown-menu') ) {
				// Did we click on an option? If so close it.
				if( !targetGroup.is('A') ) return;
			} else {
				// Nope, it's a panel. Leave it open.
				return;
			}
		}

		// Hide any dropdown that may be showing
		$(document).find('.jqdropdown:visible').each( function() {
			var jqdropdown = $(this);
			jqdropdown
				.hide()
				.removeData('jqdropdown-trigger')
				.trigger('hide', { jqdropdown: jqdropdown });
		});

		// Remove all dropdown-open classes
		$(document).find('.jqdropdown-open').removeClass('jqdropdown-open');

	}

	function position() {

		var jqdropdown = $('.jqdropdown:visible').eq(0),
			trigger = jqdropdown.data('jqdropdown-trigger'),
			hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
			vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

		if( jqdropdown.length === 0 || !trigger ) return;

		// Position the dropdown
		jqdropdown
			.css({
				left: jqdropdown.hasClass('jqdropdown-anchor-right') ?
					trigger.offset().left - (jqdropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
				top: trigger.offset().top + trigger.outerHeight() + vOffset
			});

	}

	$(document).on('click.jqdropdown', '[data-jqdropdown]', show);
	$(document).on('click.jqdropdown', hide);
	$(window).on('resize', position);

})(jQuery);
