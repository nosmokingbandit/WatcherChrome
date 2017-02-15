$(document).ready(function() {
    restore_options();

    $('button#save').click(function(){
        console.log('Saving...')
        save_options();

    })

});

// Saves options to chrome.storage
function save_options() {
  var address = document.getElementById('address').value;
  var apikey = document.getElementById('apikey').value;
  console.log(apikey)
  chrome.storage.sync.set({
    address: address,
    apikey: apikey
  }, function() {
    // Update status to let user know options were saved.
    $status = $('span#status');
    $status.text('Settings Saved');
    $status.fadeIn();
    setTimeout(function() {
      $status.fadeOut();
  }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        address: '',
        apikey: ''
    }, function(items) {
        document.getElementById('address').value = items.address;
        document.getElementById('apikey').value = items.apikey;
    });
}
