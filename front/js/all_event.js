
			var table = [
				"筑波大学", "9月3日", "筑波です", "../js/aoyama.jpg", 1,
				"青山大学", "9月3日", "青山です", "../js/aoyama.jpg", 1,
				"明治大学", "9月3日", "明治です", "../js/aoyama.jpg", 2,
				"群馬大学", "9月3日", "4", "../js/aoyama.jpg", 6,
				"栃木大学", "9月3日", "5", "../js/aoyama.jpg", 7,
				"横浜大学", "9月3日", "5", "../js/aoyama.jpg", 7
			];

			var camera, scene, renderer;
			var controls;

			var objects = [];
			var targets = { table: [], helix: [] };

			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 5000;

				scene = new THREE.Scene();

				// table

				//console.log(document.getElementById(element));



				for ( var i = 0; i < table.length; i += 5 ) {



					var element = document.createElement( 'div' );
					element.className = 'element';
					element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
					

					var image = document.createElement( 'img' );
					image.className = 'image';
					image.textContent = (i/5) + 1;
					image.setAttribute("src", table[i+3]);
					element.appendChild( image );

					var date = document.createElement( 'div' );
					date.className = 'date';
					date.textContent = table[ i+1 ];
					element.appendChild( date );


					var symbol = document.createElement( 'div' );
					symbol.className = 'symbol';
					symbol.textContent = table[ i ];
					element.appendChild( symbol );

					var comments = document.createElement( 'div' );
					comments.className = 'comments';
					comments.textContent = table[ i+2 ];
					element.appendChild( comments );

					element.addEventListener('click', function onClick (argument) {
						alert('clicked');
					})


					var object = new THREE.CSS3DObject( element );

/*

					domElemnt.addEventListener(....);

					[domElemnt,domElemnt,domElemnt,domElemnt].addEventListener(....);

object = new THREE(domElemnt);
					object.addEventListener(....);

*/
					element.addEventListener('click', function onClick (argument) {
						alert('clicked');
					})


					console.log(document.getElementsByClassName('element'));
					console.log(element);
					
					//
					scene.add( object );
					objects.push( object );

					for (var a = 0; a < objects.length; a++) {
					objects[a].addEventListener("click",function(){
							console.log("aaa");
						},false);
				}

					/*var object = new THREE.Object3D();

					targets.table.push( object );*/

					/*document.getElementsByClassName('element') => array
					[.....].add
					[....][0]


					document.getElementsByClassName('element').addEventListener("click",function(){
							console.log("aaa");
						},false);*/



					//console.log(objects);
/*
					var ele = document.getElementsByClassName("element");
					var func = new function(){
						alert("aaa");
					};
*/
					//ele.appendChild(element);

				}
				

//alert(document.getElementsByClassName('element'));

				// helix

				var vector = new THREE.Vector3();

				for ( var i = 0, l = objects.length; i < l; i ++ ) {

					var phi = i * 0.175 + Math.PI;

					var object = new THREE.Object3D();

					object.position.x = 900*Math.sin(360/objects.length-i+30);
					object.position.y = 0;
					object.position.z = 900*Math.cos(360/objects.length-i+30);

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

/*
				var button = document.getElementById( 'helix' );
				button.addEventListener( 'click', function ( event ) {

					transform( targets.helix, 2000 );

				}, false );
				
				*/
				
				
				/*
				var button_l = document.getElementById( 'left' );
				var j=1;
				button_l.addEventListener( 'click', function ( event ) {

					camera.position.x = 3000*Math.sin(360/objects.length-j+30);
					camera.position.y = 0;
					camera.position.z = 3000*Math.cos(360/objects.length-j+30);
					j++;
					if(j==6){
						j=1.5;
					}

				}, false );			
				*/
				
				transform( targets.helix, 2000 );

				//

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

			//camera.lookAt(new THREE.Vector3(0, 0, 0));
			// camera.position.y=0;
			// console.log(JSON.stringify(camera.position));
				renderer.render( scene, camera );
			}
