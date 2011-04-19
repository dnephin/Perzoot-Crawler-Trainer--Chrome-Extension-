

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
 * Retrieve options from background
 */
var OPTIONS;
chrome.extension.sendRequest({'action': 'getOptions'}, function(data) {
	OPTIONS = data;
});


/*
 * Display menu
 */
chrome.extension.sendRequest({
		'action': 'getHTML', 
		'page': 'menu.html'
	}, function(page_data) {
		$('#pz_crawler_training_menu').detach();
		$('body').append(page_data);
	
		/*
		 * Setup events
		 */
		LINK_TYPE = $('input[name=link_type]:checked').val();
		$('input[name=link_type]').change(function(event) {
			LINK_TYPE = $('input[name=link_type]:checked').val();
		});
	
		/*
		 * Display summary before send.
		 */
		$('#send_button').click(function(event) {
			display_summary();
		});
	}
);


/*
 * Send data.
 */
send_data = function(event) {
	$('#data_summary').detach();
	var data = {'html': $('html').html() };
	if ($('#include_url')) {
		data.search_url = document.location.href;
	}

	if ($('#find_date')) {
		data.includes_date = true; 
	}
	
	chrome.extension.sendRequest({
		'action': 'sendData',
		'data': data
	}, function(response) {
		if (!response) {
			alert(chrome.extension.lastError);
			return;
		}
		$('#pz_crawler_training_menu').append('<div>Success!</div>');
	});
}

/*
 * Display summary.
 */
function display_summary() {
	chrome.extension.sendRequest({
		'action': 'getHTML', 
		'page': 'data_summary.html'
	}, function(page_data) {
		console.log('received data.');
//		$('#data_summary').detach();
//		$('body').append(page_data);
//
//		$('#send_button').click(send_data);
//		$('#cancel_button').click(function (event) {
//			$('#data_summary').detach();
//		});
//
//		$.each(LINK_CLASS_NAMES, function(name, class_name) {
//			var elems = $('.'+class_name);
//			$('#sum_'+name).append(' <em> ('+elems.length+') </em>');
//			elems.each(function(index, tag) {
//				$('#sum_'+name).next('ul').append('<li>'+tag.attr('href')+'</li>');
//			});
//		});
	});
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
		console.log('saved link as listing page.');
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

