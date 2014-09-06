(function() {
  var camera, scene, renderer;
  var controls;
  var objects = [];
  var targets = { table: [], helix: [] };

  function init(data) {
    camera = new THREE.PerspectiveCamera(
      40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 3000;

    scene = new THREE.Scene();

    $.each(data, function(key, value) {

      var element = document.createElement( 'div' );
      element.className = 'element';
      element.style.backgroundColor = 'rgba(0,127,127,' +
          ( Math.random() * 0.5 + 0.25 ) + ')';

          var image = document.createElement('img');
          image.className = 'image';
          // image.textContent = (i/5) + 1;
          // image.setAttribute("src", table[i+3]);
          if (value["university_image"] != null) {
            image.setAttribute("src", "../image/" + value["university_image"]);
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
    document.getElementById( 'container' ).appendChild( renderer.domElement );

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

  (function() {
    $.ajax({
      url: 'http://172.30.16.197:4567/getEvents.json',
      type: 'GET',
      cache: true,
      datatype: 'json',
      success: function(data) {
        console.log("***ajax connection success***");
        init(data);
        animate();
        // $.each(data, function(arr_key, hash) {
        //   $.each(hash, function(hash_key, value) {
        //     console.log(hash_key + ": " + value);
        //   });
        // });
      },
      error: function() {
        console.log("error");
      }
    });
  })();

  window.event_init = init;
  window.event_animate = animate;
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
