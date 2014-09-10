(function() {

  function GetQueryString() {
    var result = {};
    if (1 < window.location.search.length) {
      var query = window.location.search.substring(1);
      var parameters = query.split('&');
      for (var i = 0; i < parameters.length; i++) {
        var element = parameters[i].split('=');
        var paramName = decodeURIComponent(element[0]);
        var paramValue = decodeURIComponent(element[1]);
        result[paramName] = paramValue;
      }
    }

    if (result.length != 0 && result["user_id"]) {
    }
    else {
      window.location = "http://6e227a95.ngrok.com";
    }
  }

  GetQueryString();
})();
