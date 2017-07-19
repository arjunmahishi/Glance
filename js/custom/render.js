function renderText(text, root){
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
		var mesh	= new THREE.Mesh( geometry, material );
		mesh.position.x = -0.2;
		mesh.rotation.x = -1.5;
		root.add( mesh );
	} );
}

function renderBox(root){
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