


var LINK_TYPE;
var DISABLE_CLICK = true;


/*
 * Display menu
 */
chrome.extension.sendRequest({'action': 'getMenu'}, function(data) {
	$('#pz_crawler_training_menu').detach();
	$('body').append(data);

	/*
	 * Setup events
	 */
	$('input[name=link_type').change(function(event) {


	});


	/*
	 * Send event.
	 */
	$('#send_button').click(function(event) {
		chrome.extension.sendRequest({
			'action': 'sendData',
			'data': $('html'),
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
		console.log('over ' + event.target.href);
		elem = $(event.target);
		elem.addClass('pz_link_over');
	}, function(event) {
		event.preventDefault();
		console.log('out ' + event.target.href);
		elem = $(event.target);
		elem.removeClass('pz_link_over');
	}
).click( function(event) {
	event.preventDefault();
	$(event.target).addClass('PERZOOT_CRAWL_POST_LINK');
});



// TODO: setup keyshortcuts for buttons
// TODO: setup keyshortcut for disabling the preventDefault of clicks.
$(document).keypress(function(event) {
	// 65 = a
	if (event.which == 65) {
		console.log('saved link as posting page.');
		return;
	}

	// 83 = s
	if (event.which == 83) {
		console.log('saved link as listing page.');
		return;
	}
});


// TODO: send data.
test_func = function(data) {

};
