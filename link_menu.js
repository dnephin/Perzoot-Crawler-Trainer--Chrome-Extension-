/*
 * Context Script
 *
 * Displays menu, data summary, and annotates links to be classified.
 */

/*
 * Globals and Constants.
 */
var LINK_TYPE;
var TOGGLE_ACTIVE = true;
var LINK_CLASS_NAMES = {
	// Keys should match values in link_type input in menu.html
	'posting_links': 'PERZOOT_CRAWLER_POSTING',
	'listing_links': 'PERZOOT_CRAWLER_LISTING',
	'junk_links': 'PERZOOT_CRAWLER_JUNK'
};


/*
 * Connect to background channel.
 */
var port = chrome.extension.connect({'name': 'background_channel'});
/*
 * Fetch menu
 */
port.postMessage({'action': 'getHTML', 'page': 'menu.html'});
/*
 * Retrieve options from background
 */
var OPTIONS;
port.postMessage({'action': 'getOptions'});

/*
 * Message channel handling.
 */
port.onMessage.addListener(function(msg) {

	console.log('link_menu received: ' + msg.response)

	if (msg.response == 'getHTML') {
		if (msg.page == 'menu.html') {
			$('#pz_crawler_training_menu').detach();
			$('body').append(msg.data);
	
			// Setup events
			LINK_TYPE = $('input[name=link_type]:checked').val();
			$('input[name=link_type]').change(function(event) {
				LINK_TYPE = $('input[name=link_type]:checked').val();
			});
	
			// Display summary before send.
			$('#show_summary').click(function(event) {
				port.postMessage({'action': 'getHTML', 'page': 'data_summary.html'});
			});
			return;
		}

		if (msg.page == 'data_summary.html') {
			$('#data_summary').detach();
			$('body').append(msg.data);
	
			$('#send_button').click(send_data);
			$('#cancel_button').click(function (event) {
				$('#data_summary').detach();
			});
	
			$.each(LINK_CLASS_NAMES, function(name, class_name) {
				var elems = $('.'+class_name);
				$('#sum_'+name).append(' <em> ('+elems.length+') </em>');
				elems.each(function(index, tag) {
					$('#sum_'+name).next('ul').append('<li>'+$(tag).attr('href')+'</li>');
				});
			});
			if ($('#include_url').attr('checked')) {
				var text = document.location.href;
				if ($('#find_date').attr('checked')) {
					text += ' <em>includes date</em> ';
				}
				$('#included_page_url').append(text);
			} else {
				$('#included_page_url').detach();
			}
			return;
		}
	}

	if (msg.response == 'getOptions') {
		OPTIONS = msg.options;
	}

	if (msg.response == 'sendData') {
		var text = (msg.success) ? 'Success' : 'Failed';
		$('#pz_crawler_training_menu').append('<div>'+text+'!</div>');
	}
});


/*
 * Send data.
 */
send_data = function(event) {
	$('#data_summary').detach();
	var data = {'html': $('body').html() };
	if ($('#include_url').attr('checked')) {
		data.search_url = document.location.href;
	}

	if ($('#find_date').attr('checked')) {
		data.includes_date = true; 
	}
	
	port.postMessage({'action': 'sendData', 'data': data})
}


/*
 * Highlight and prevent from following links.
 */
$('a').hover(
	function(event) {
		if (TOGGLE_ACTIVE) {
			$(event.target).addClass('pz_link_over');
		}
	}, function(event) {
		$(event.target).removeClass('pz_link_over');
	}
).click( function(event) {
	if (TOGGLE_ACTIVE) {
		event.preventDefault();
	}
	$(event.target).addClass(LINK_CLASS_NAMES[LINK_TYPE]);
});


/*
 * Capture key events.
 */
$(document).keydown(function(event) {
	if (event.which == OPTIONS['posting_key'].charCodeAt(0)) {
		console.log('saved link as posting page.');
		$('input[name=link_type][value=posting_links]').click();
		return;
	}

	if (event.which == OPTIONS['listing_key'].charCodeAt(0)) {
		console.log('saved link as listing page.');
		$('input[name=link_type][value=listing_links]').click();
		return;
	}

	if (event.which == OPTIONS['junk_key'].charCodeAt(0)) {
		console.log('saved link as junk page.');
		$('input[name=link_type][value=junk_links]').click();
		return;
	}

	if (event.which == OPTIONS['link_toggle_key'].charCodeAt(0)) {
		$('#link_status').show()
		TOGGLE_ACTIVE = false;
		return;
	}
}).keyup(function(event) {
	if (event.which == OPTIONS['link_toggle_key'].charCodeAt(0)) {
		$('#link_status').hide()
		TOGGLE_ACTIVE = true;
		return;
	}
});

