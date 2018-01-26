const renderText = (text, root) =>{
    var loader = new THREE.FontLoader();

	loader.load( 'fonts/Roboto_Regular.json', function ( font ) {

		var geometry = new THREE.TextGeometry( text, {
			font: font,
			size: 0.1,
			height: 0.1,
		} );

		// var material	= new THREE.MeshNormalMaterial(); 
		var material	= new THREE.MeshNormalMaterial({
			transparent : true,
			opacity: 1,
			side: THREE.DoubleSide
		}); 

		var planeMaterial = new THREE.ShadowMaterial();
		planeMaterial.opacity = 1;

		var mesh	= new THREE.Mesh( geometry, planeMaterial );
		mesh.position.x = -0.2;
		mesh.rotation.x = -1.5;
		root.add( mesh );
	} );
}

const renderBox = root =>{
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshNormalMaterial({
		transparent : true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.y	= geometry.parameters.height/2
	root.add( mesh );
}

const renderSprite = root =>{
	var spriteMaterial = new THREE.SpriteMaterial({ 
		color: 0xffffff, 
		opacity: 0.5 
	});
	var sprite = new THREE.Sprite( spriteMaterial );
	root.add( sprite );
	return sprite;
}

const renderObject = (root, objectURL) => new THREE.ObjectLoader().load(objectURL, obj => root.add(obj));

const renderScene = (root, sceneURL) => {
	new THREE.JSONLoader().load(sceneURL, ( geometry, materials ) =>{
		var material = materials[0];
		var object = new THREE.Mesh(geometry, material);
		console.log('scene', object);
		root.add( object );
	}, err =>{
		console.log(err)
	});
}