(function() {
  var camera, scene, renderer;
  var controls;
  var objects = [];
  var targets = { table: [], helix: [] };
  var user_id = 0;

  function init(data) {
    var container = document.getElementById("container");
    for (var i = container.childNodes.length - 1; i >= 0; i--) {
      container.removeChild(container.childNodes[i]);
    }
    objects = [];
    targets = { table: [], helix: [] };
    camera = new THREE.PerspectiveCamera(
      40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    $.each(data, function(key, value) {

      var element = document.createElement( 'div' );
      element.className = 'element';
      element.setAttribute("id", "univ" + value["category_num"]);
      element.style.backgroundColor = 'rgba(0,127,127,' +
        ( Math.random() * 0.5 + 0.25 ) + ')';

        var image = document.createElement('img');
        image.className = 'image';
        // image.textContent = (i/5) + 1;
        // image.setAttribute("src", table[i+3]);
        if (value["university_image"] != null) {
          image.setAttribute("src", "../../public/image/" + value["university_image"]);
        }
        else {
          image.alt = "画像未登録"
        }
        element.appendChild( image );

        var name_date_area = document.createElement('div');
        name_date_area.className = 'name_date_area';
        var name = document.createElement('p');
        var date = document.createElement('p');
        name.className = 'name';
        date.className = 'date';
        name.textContent = value["user_name"] + " さん";
        date.textContent = value["deadline"];
        name_date_area.appendChild(name);
        name_date_area.appendChild(date);
        element.appendChild(name_date_area);

        var symbol = document.createElement('div');
        symbol.className = 'symbol';
        symbol.textContent = value["university_name"];
        element.appendChild(symbol);

        var comments = document.createElement('div');
        comments.className = 'comments';
        var event_name = document.createElement('p');
        var event_content = document.createElement('p');
        event_name.className = 'event_name';
        event_content.className = 'event_content';
        event_name.textContent = value["name"];
        event_content.textContent = value["content"];
        comments.appendChild(event_name);
        comments.appendChild(event_content);
        element.appendChild(comments);


        var object = new THREE.CSS3DObject( element );

        scene.add( object );
        objects.push( object );

        var object = new THREE.Object3D();

        targets.table.push( object );
    });

    // helix

    var vector = new THREE.Vector3();

    for ( var i = 0, l = objects.length; i < l; i ++ ) {

      var phi = i * 0.175 + Math.PI;

      var object = new THREE.Object3D();
      var angle = 2 * Math.PI/objects.length;

      object.position.x = 600 * Math.sin(i * angle);;
      object.position.y = 0;
      object.position.z = 600 * Math.cos(i * angle);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;


      object.lookAt( vector );

      targets.helix.push( object );
      //console.log(objects);
    }
    //console.log(objects.length);



    //

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.height = '250px';
    renderer.className = "renderer";
    document.getElementById('container').appendChild(renderer.domElement);

    //


    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    controls.noZoom = true;
    controls.noPan=true;
    //controls.target.set(0,500,0);
    //controls.noRotate=true;


    controls.addEventListener( 'change', render );


    var button = document.getElementById( 'helix' );
    button.addEventListener( 'click', function ( event ) {

      transform( targets.helix, 2000 );

    }, false );





    var button_l = document.getElementById( 'left' );
    var j=1;

    transform( targets.helix, 2000 );
    window.addEventListener( 'resize', onWindowResize, false );
  }

  function transform( targets, duration ) {

    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) {

      var object = objects[ i ];
      var target = targets[ i ];

      new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

      new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

    }

    new TWEEN.Tween( this )
      .to( {}, duration * 2 )
      .onUpdate( render )
      .start();

  }


  function transform2( targets,obj, duration ) {

    TWEEN.removeAll();
    var start_point = new THREE.Object3D();

    for ( var i = 0; i < obj.length; i ++ ) {

      var object = obj[ i ];
      var target = targets[ i ];

      new TWEEN.Tween( object.position )
        .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

      new TWEEN.Tween( object.rotation )
        .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
        .easing( TWEEN.Easing.Exponential.InOut )
        .start();

    }

    new TWEEN.Tween( this )
      .to( {}, duration * 2 )
      .onUpdate( render )
      .start();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
  }

  function animate() {
    requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();
  }

  function render() {
    // console.log(camera.position);
    //camera.lookAt(new THREE.Vector3(0, 0, 0));
    //camera.position.y=0;
    renderer.render( scene, camera );
  }

  var getEvents = function() {
    var reqDatas = window.location.search.substr(1).split("&");
    for (var i = 0; i < reqDatas.length; i++) {
      var reqData = reqDatas[i].split("=");
      if (reqData[0] == "id") {
        user_id = reqData[1];
        break;
      }
    }

    if (user_id == 0) {
      window.location = "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html?user_id=0"
    }
    $.ajax({
      url: "http://6e227a95.ngrok.com/getEvents.json?id=" + user_id,
      type: 'GET',
      cache: true,
      datatype: 'json',
      success: function(data) {
        console.log("***ajax connection success***");
        init(data);
        animate();
        // $.each(data, function(arr_key, hash) {
        //   $.each(hash, function(hash_key, value) {
        // console.log(hash_key + ": " + value);
        //   });
        // });
      },
      error: function() {
        console.log("error");
      }
    });
  }

  function new_event() {
    var reqDatas = window.location.search.substr(1).split("&");
    for (var i = 0; i < reqDatas.length; i++) {
      var reqData = reqDatas[i].split("=");
      if (reqData[0] == "id") {
        user_id = reqData[1];
        break;
      }
    }

    childs = document.getElementById("new-event").childNodes;
    datas = [];
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].tagName == "DIV") {
        if (childs[i].childNodes[3].tagName == "SELECT") {
          var select = childs[i].childNodes[3];
          for (var j = 0; j < select.childNodes.length; j++) {
            if (select.childNodes[j].tagName == "OPTION") {
              var option = select.childNodes[j];
              if (option.selected) {
                datas.push(option.value);
              }
            }
          }
        }
        else {
          datas.push(childs[i].childNodes[3].value);
        }
      }
    }
    // console.log(datas);
    $.ajax({
      url: 'http://6e227a95.ngrok.com/newEvent?id=' + user_id,
      type: 'POST',
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      cache: true,
      datatype: 'json',
      data: {title:datas[0], contents:datas[1], deadline:datas[2], category:datas[3]},
      success: function(data) {
        console.log("***ajax connection success***");
      }, error: function() {
        console.log("error");
      }
    });
    getEvents();
  }

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
        var logout = document.createElement('a');
        name.className = 'my-name';
        img.className = 'my-university-image';
        logout.className = 'logout-link';
        img.setAttribute("src", "../../public/image/" + data["university_image"]);
        name.textContent = "こんにちは、" + data["name"] + "さん";
        logout.textContent = "ログアウト";
        logout.setAttribute("href", "https://dl.dropboxusercontent.com/u/54211252/campuspace/front/html/index.html?user_id=0");
        header.appendChild(img);
        header.appendChild(name);
      }, error: function() {
        console.log("error");
      }
    });
  })();

  $(function() {
    $(".category").click(function() {
      var filter_num = $(this).attr("id");
      var categories = [];
      var category_targets = [];
      for(var i=0;i<objects.length;i++){
        scene.remove(objects[i]);
        console.log(objects[i].element.id);
        if(objects[i].element.id==filter_num){
          categories.push(objects[i]);
        }
      }
      var angle = 2 * Math.PI/categories.length;
      vector = new THREE.Vector3();

      for(var i=0;i<categories.length;i++){
        scene.add(categories[i]);
        var object = new THREE.Object3D();

        categories[i].position.x = 900 * Math.sin(i * angle);
        categories[i].position.y = 0;
        categories[i].position.z = 900 * Math.cos(i * angle);

        vector.x = categories[i].position.x * 2;
        vector.y = categories[i].position.y;
        vector.z = categories[i].position.z * 2;

        categories[i].lookAt( vector );
        ategory_targets.push(object);
      }
      transform2(category_targets,categories,2000);
      render();
    });
  });

  function all_universities() {
    window.location = "./all_universities.html?id=" + user_id;
  }

  window.event_init = init;
  window.event_animate = animate;
  window.new_event = new_event;
  window.all_universities = all_universities;
  getEvents();
})();

$(document).ready(function(){
  $('.modalLink').modal({
    trigger: '.modalLink',
    olay:'div.overlay',
    modals:'div.modal',
    animationEffect: 'slidedown',
    animationSpeed: 100,
    moveModalSpeed: 'slow',
    background: '00c2ff',
    opacity: 0.8,
    openOnLoad: false,
    docClose: true,
    closeByEscape: true,
    moveOnScroll: true,
    resizeWindow: true,
    close:'.closeBtn'
  });
});

