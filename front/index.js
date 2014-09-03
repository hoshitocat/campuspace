function get() {
  $.ajax({
    url: 'http://127.0.0.1:4567/show',
    type: 'GET',
    cache: true,
    datatype: 'json',
    success: function(data) {
      json_data = JSON.parse(data);
      $.each(json_data, function(key, value) {
        console.log(key, value);
      });
    },
    error: function() {
      console.log("error");
    }
  });
}

// function GetData(){
//   var ajax=null;
//   //XMLHttpRequestが使えるか
//   if(XMLHttpRequest){
//     ajax=new XMLHttpRequest();
//   }else{
//     ajax= new ActiveXObject('MSXML2.XMLHTTP.6.0');
//     if(!ajax){
//       ajax = ActiveXObject('MSXML2.XMLHTTP.3.0');
//       if(!ajax){
//         ajax = ActiveXObject('MSXML2.XMLHTTP');
//         //ajax通信は行えないので処理終了
//         if(!ajax){
//           alert("ajaxは使えません");
//           return;
//         }
//       }
//     }
//   }
//
//   ajax.open('GET', 'http://localhost:4567/show', true);
//   ajax.onreadystatechange = function Receive() {
//     if (ajax.readyState==4 && ajax.status==200) {
//       alert(ajax.responseText);
//       return;
//       //200以外はエラー
//     } else if (ajax.status!=200){
//       alert("エラーが発生しました："+ajax.status);
//       return;
//     }
//   }
//   //サーバ側で処理する場合は、以下のヘッダーの設定が必要。
//   //.setRequestHeader('Content-Type',"application/x-www-form-urlencoded; charset=utf-8");
//   ajax.send(null);
// }
