$(document).ready(function() {
	var icon_add = chrome.extension.getURL('../images/icon_add.png');
	var icon_send = chrome.extension.getURL('../images/icon_send.png');
	var imdbid = $('div#star-rating-widget').attr('data-tconst');
	var title = $.trim($("h1[itemprop=name]").text());

	var $button = $(`<div id="watcher_add" title="Add to Watcher">
				 	<img src="${icon_add}"/>
					<div id='watcher_popup'>
						<div id='watcher_add_movie'>
							Add <b>${title}</b> to Watcher
							<br/>
							Quality Profile:
							<select id='watcher_quality'>
								<option value='Default' selected>
									Default
								</option>
							</select>
							<img src='${icon_send}' id='watcher_send'/>
						</div>
						<div id='watcher_thinker'></div>
						<div id='watcher_response'></div>
					</div>
				 </div>`);

	$('div.title_wrapper').prepend($button);
	var $popup = $('div#watcher_popup');
	var $select = $('select#watcher_quality');
	var $response = $('div#watcher_response');
	var $thinker = $('div#watcher_thinker');

	$('div#watcher_add img').click(function(){
		chrome.storage.sync.get({
			address: '',
			apikey: ''
		}, function(config) {

			$.get(config.address+'/api?apikey='+config.apikey+'&mode=get_config', function(r){
				qualities = JSON.parse(r)['Quality']['Profiles'];
				$.each(qualities, function(prop, val){
					if(prop != 'Default'){
						var opt = `<option value="${prop}">${prop}</option>`
						$select.append(opt)
					}
				});
			});
			$popup.fadeIn();

		});
	})

	$('img#watcher_send').click(function(){

		$('div#watcher_add_movie').fadeOut();
		$popup.animate({width: $thinker.width(),
						height: $thinker.height()
						}, 200);
		$thinker.fadeIn();

		chrome.storage.sync.get({
			address: '',
			apikey: ''
		}, function(config) {

			profile = $('select#watcher_quality').val();

			url = `${config.address}/api?apikey=${config.apikey}&mode=addmovie&imdbid=${imdbid}&profile=${profile}`;

			$.get(url, function(r){
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
});


function get_time(){
	s = parseInt(new Date().getTime() / 1000)
	return s
}
