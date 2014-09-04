(function(){
  var a = 1;
  function getEvents() {
    $.ajax({
      url: 'http://127.0.0.1:4567/getEvents.json',
      type: 'GET',
      cache: true,
      datatype: 'json',
      success: function(data) {
        console.log("success");
        console.log(data);
        $.each(data, function(arr_key, hash) {
          $.each(hash, function(hash_key, value) {
            console.log(hash_key + ": " + value);
          });
        });
      },
      error: function() {
        console.log("error");
      }
    });
  }

  window.getEvents = getEvents;
})();
