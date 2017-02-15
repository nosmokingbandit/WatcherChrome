$(document).ready(function() {
	var open = false;
	var icon_add = chrome.extension.getURL('../images/logo_48.png');
	var icon_send = chrome.extension.getURL('../images/icon_send.png');
	var icon_close = chrome.extension.getURL('../images/icon_close.png');
	var tmdbid = $('meta[property="og:url"').attr('content').split('/')[4].split('-')[0]
	var title = $.trim($('h2.movie a').text());

	var $button = $(`<div id="watcher_add" title="Add to Watcher">
					<img src='${icon_close}' id='watcher_icon_close'/>
				 	<img src='${icon_add}' id='watcher_icon_add'/>
					<div id='watcher_popup'>
						<div id='watcher_add_movie'>
							Add <b>${title}</b> to Watcher
							<br/>
							Quality Profile:
							<select id='watcher_quality'>
							</select>
							<img src='${icon_send}' id='watcher_send'/>
						</div>
						<div id='watcher_thinker'></div>
						<div id='watcher_response'></div>
					</div>
				 </div>`);

	$('div.title').prepend($button);
	var $close_button = $('img#watcher_icon_close');
	var $popup = $('div#watcher_popup');
	var $select = $('select#watcher_quality');
	var $response = $('div#watcher_response');
	var $add_dialog = $('div#watcher_add_movie');
	var ad_width;
	var ad_height;
	var $thinker = $('div#watcher_thinker');

	$close_button.click(function(){
		close();
	});

	$('img#watcher_icon_add').click(function(){
		if(open == true){
			close();
			open = false;
			return true
		}

		chrome.storage.sync.get({
			address: '',
			apikey: ''
		}, function(config) {
			url = `${config.address}/api?apikey=${config.apikey}&mode=get_config`;

			chrome.runtime.sendMessage({
				method: 'GET',
				action: 'xhttp',
				url: url,
				data: ''
				}, function(r) {
				qualities = JSON.parse(r)['Quality']['Profiles'];
				$select.find('option').remove();
				$select.append('<option value="Default" selected>Default</option>');
				$.each(qualities, function(prop, val){
					if(prop != 'Default'){
						var opt = `<option value="${prop}">${prop}</option>`
						$select.append(opt)
					}
				});
			});
			$close_button.fadeIn();
			$popup.fadeIn();
			open = true;
		});
	});


	$('img#watcher_send').click(function(){

		ad_width = $add_dialog.width();
		ad_height = $add_dialog.height();
		$add_dialog.fadeOut();
		$popup.animate({width: $thinker.width(),
						height: $thinker.height()
						}, 200);
		$thinker.fadeIn();

		chrome.storage.sync.get({
			address: '',
			apikey: ''
		}, function(config) {

			profile = $('select#watcher_quality').val();

			url = `${config.address}/api?apikey=${config.apikey}&mode=addmovie&tmdbid=${tmdbid}&profile=${profile}`;

			chrome.runtime.sendMessage({
				method: 'GET',
				action: 'xhttp',
				url: url,
				data: ''
				}, function(r) {
				response = JSON.parse(r);
				if(response['response'] == true){
					$response.text(`${title} added to Wanted list.`)
				} else {
					$response.text(response['error'])
				};
				$thinker.fadeOut();
				$popup.animate({width: $response.width(),
								height: $response.height()
								}, 200);
				$response.fadeIn();
			});
		});
	});

	function close(){
		$close_button.fadeOut();
		$popup.hide();
		$popup.find('div').hide();
		$add_dialog.show();
		$popup.width(ad_width);
		$popup.height(ad_height);
	};

});
