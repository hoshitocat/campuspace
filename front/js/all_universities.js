(function() {
  var user_id = 0;
  (function() {
    var reqDatas = window.location.search.substr(1).split("&");
    var user_id = 0;
    for (var i = 0; i < reqDatas.length; i++) {
      var reqData = reqDatas[i].split("=");
      if (reqData[0] == "id") {
        user_id = reqData[1];
        break;
      }
    }
    $.ajax({
      url: 'http://6e227a95.ngrok.com/user.json?id=' + user_id,
      type: 'GET',
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: true,
      datatype: 'json',
      success: function(data) {
        console.log("***ajax connection success***");
        var header = document.getElementById("header");
        var name = document.createElement('p');
        var img = document.createElement('img');
        name.className = 'my-name';
        img.className = 'my-university-image';
        img.setAttribute("src", "../../public/image/" + data["university_image"]);
        name.textContent = "こんにちは、" + data["name"] + "さん";
        header.appendChild(img);
        header.appendChild(name);
      }, error: function() {
        console.log("error");
      }
    });
  })();

  (function() {
    $.ajax({
      url: "http://6e227a95.ngrok.com/getUniversities.json",
      type: "GET",
      cache: true,
      datatype: "json",
      success: function(data) {
        console.log("***ajax connection success***");
        console.log(data);
      },
      error: function() {
        console.log("##########error#############");
      }
    });
  })();

})();
