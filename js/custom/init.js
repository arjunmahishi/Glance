THREEx.ArToolkitContext.baseURL = '/';

//////////////////////////////////////////////////////////////////////////////////
	//		Init
	//////////////////////////////////////////////////////////////////////////////////

	// init renderer
	var renderer	= new THREE.WebGLRenderer({
		antialias	: true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	// renderer.setPixelRatio( 1/2 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	// document.body.appendChild( renderer.domElement );
	document.querySelector("#view-finder").appendChild(renderer.domElement);

	// array of functions for the rendering loop
	var onRenderFcts= [];

	// init scene and camera
	var scene	= new THREE.Scene();
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Initialize a basic camera
	//////////////////////////////////////////////////////////////////////////////////

	// Create a camera
	// var camera = new THREE.Camera();
	var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	scene.add(camera);

	////////////////////////////////////////////////////////////////////////////////
	//          handle arToolkitSource
	////////////////////////////////////////////////////////////////////////////////

	var arToolkitSource = new THREEx.ArToolkitSource({
		// to read from the webcam 
		sourceType : 'webcam',

		// to read from an image
		// sourceType : 'image',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		

		// to read from a video
		// sourceType : 'video',
		// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
	})

	arToolkitSource.init(function onReady(){
		onResize()
	})
	
	// handle resize
	window.addEventListener('resize', function(){
		onResize()
	})
	function onResize(){
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if( arToolkitContext.arController !== null ){
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}
	////////////////////////////////////////////////////////////////////////////////
	//          initialize arToolkitContext
	////////////////////////////////////////////////////////////////////////////////
	

	// create atToolkitContext
	var arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/camera_para.dat',
		detectionMode: 'mono',
		maxDetectionRate: 30,
		canvasWidth: 80*3,
		canvasHeight: 60*3,
	})
	// initialize it
	arToolkitContext.init(function onCompleted(){
		// copy projection matrix to camera
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	})

	// update artoolkit on every frame
	onRenderFcts.push(function(){
		if( arToolkitSource.ready === false )	return

		arToolkitContext.update( arToolkitSource.domElement )
	})
	
	
	////////////////////////////////////////////////////////////////////////////////
	//          Create a ArMarkerControls
	////////////////////////////////////////////////////////////////////////////////
	
	var markerRoot = new THREE.Group
	scene.add(markerRoot)
	var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
		type : 'pattern',
		// patternUrl : THREEx.ArToolkitContext.baseURL + 'data/patt.hiro'
		patternUrl : THREEx.ArToolkitContext.baseURL + 'data/patt.kanji'
		// patternUrl : THREEx.ArToolkitContext.baseURL + 'data/111.patt'
		// patternUrl : THREEx.ArToolkitContext.baseURL + 'data/fnp.patt'
		// patternUrl : THREEx.ArToolkitContext.baseURL + 'data/srm.patt'
	})


	let markerName = artoolkitMarker.parameters.patternUrl.split("/");


	console.log("Using ", markerName[markerName.length-1]);

	document.querySelector("#marker").innerHTML = markerName[markerName.length-1];

	// build a smoothedControls
	var smoothedRoot = new THREE.Group()
	scene.add(smoothedRoot)
	var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
		lerpPosition: 0.4,
		lerpQuaternion: 0.3,
		lerpScale: 1,
	})
	onRenderFcts.push(function(delta){
		smoothedControls.update(markerRoot)
	})
	//////////////////////////////////////////////////////////////////////////////////
	//		add an object in the scene
	//////////////////////////////////////////////////////////////////////////////////

	main();
	console.log("scene: ", scene);



	//////////////////////////////////////////////////////////////////////////////////
	//		raycaster
	//////////////////////////////////////////////////////////////////////////////////

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	function onMouseMove( event ) {

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		console.log("click: ", mouse);

	}

	function render() {

		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children );

		console.log("intersects: ", intersects)

		for ( var i = 0; i < intersects.length; i++ ) {

			intersects[ i ].object.material.color.set( 0xff0000 );

		}

		// renderer.render( smoothedRoot, camera );

	}

	window.addEventListener( 'mousemove', onMouseMove, false );

	window.requestAnimationFrame(render);




	//////////////////////////////////////////////////////////////////////////////////
	//		render the whole thing on the page
	//////////////////////////////////////////////////////////////////////////////////
	var stats = new Stats();
	// document.body.appendChild( stats.dom );
	document.querySelector("#view-finder").appendChild(stats.dom);
	// render the scene
	onRenderFcts.push(function(){

		raycaster.setFromCamera( mouse, camera );

		// calculate objects intersecting the picking ray
		var intersects = raycaster.intersectObjects( scene.children );

		for ( var i = 0; i < intersects.length; i++ ) {

			intersects[ i ].object.material.color.set( 0xff0000 );

		}

		// renderer.render( smoothedRoot, camera );

		renderer.render( scene, camera );
		stats.update();
	})

	// run the rendering loop
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})