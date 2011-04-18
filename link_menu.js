


var LINK_TYPE;
var DISABLE_CLICK = true;
var LINK_CLASS_NAMES = {
	// Keys should match values in link_type input in menu.html
	'posting_links': 'PERZOOT_CRAWLER_POSTING',
	'listing_links': 'PERZOOT_CRAWLER_LISTING'
};


/*
 * Display menu
 */
chrome.extension.sendRequest({'action': 'getMenu'}, function(data) {
	$('#pz_crawler_training_menu').detach();
	$('body').append(data);

	/*
	 * Setup events
	 */
	LINK_TYPE = $('input[name=link_type]:checked').val();
	$('input[name=link_type]').change(function(event) {
		LINK_TYPE = $('input[name=link_type]:checked').val();
	});


	/*
	 * Send event.
	 */
	$('#send_button').click(function(event) {

		// TODO: show summary  and prompt for confirm

		chrome.extension.sendRequest({
			'action': 'sendData',
			'data': $('html').html(),
			// TODO: page url if set to true
			// TODO: find date if set to true
			}, function(data) {
				// TODO: report success
			}
		);
	});
});




/*
 * Highlight and prevent from following links.
 */
$('a').hover(
	function(event) {
		// mouse over
		$(event.target).addClass('pz_link_over');
	}, function(event) {
		$(event.target).removeClass('pz_link_over');
	}
).click( function(event) {
	if (DISABLE_CLICK) {
		event.preventDefault();
	}
	$(event.target).addClass(LINK_CLASS_NAMES[LINK_TYPE]);
	// TODO: remove other class ?
});



// TODO: setup keyshortcuts for buttons
// TODO: setup keyshortcut for disabling the preventDefault of clicks.
$(document).keydown(function(event) {
	console.log(event)
	// 65 = a
	if (event.which == 65) {
		console.log('saved link as posting page.');
		$('input[name=link_type][value=posting_links]').click();
		return;
	}

	// 83 = s
	if (event.which == 83) {
		console.log('saved link as listing page.');
		$('input[name=link_type][value=listing_links]').click();
		return;
	}

	// 16 = [shift]
	if (event.which == 16) {
		DISABLE_CLICK = false;
		return;
	}
});

	// 67 = q

$(document).keyup(function(event) {
	// 16 = [shift]
	if (event.which == 16) {
		DISABLE_CLICK = true;
		return;
	}
});


// TODO: send data.
test_func = function(data) {

};
