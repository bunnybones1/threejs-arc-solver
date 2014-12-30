var onReady = function() {
	var View = require('threejs-managed-view').View;
	var ArcSolver = require('./');
	var view = new View({
		useRafPolyfill: false
	});
	var scene = view.scene;

	var sphereGeometry = new THREE.SphereGeometry(1.5);
	// var size = 500;
	// var sizeHalf = size * .5;
	// var bounds = new THREE.Box3(
	// 	new THREE.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
	// 	new THREE.Vector3(sizeHalf, sizeHalf, sizeHalf)
	// )
	// var random = new THREE.Vector3();
	// var boundSize = bounds.size();
	// for (var i = 0; i < 1200; i++) {
	// 	var ball = new THREE.Mesh(sphereGeometry);
	// 	scene.add(ball);
	// 	random.set(
	// 		Math.random(),
	// 		Math.random(),
	// 		Math.random()
	// 	);
	// 	ball.position.copy(bounds.min).add(random.multiply(boundSize));
	// };

	var spin = new THREE.Object3D();
	view.scene.add(spin);
	var v = [];
	var material1 = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var colors = [
		new THREE.Color(.4, .5, .6),
		new THREE.Color(.6, .7, .8),
		new THREE.Color(.8, .9, 1)
	]
	var vertBalls = [];
	for (var i = 0; i < 3; i++) {
		v[i] = new THREE.Vector3(
			(Math.random() - .5) * 3, 
			(Math.random() - .5) * 3, 
			(Math.random() - .5) * 3
		);
		var ball = new THREE.Mesh(
			sphereGeometry, 
			new THREE.MeshBasicMaterial({
				color: colors[i]
			})
		);
		ball.position.copy(v[i]);
		ball.scale.set(.1, .1, .1);
		spin.add(ball);
		vertBalls.push(ball);
	};
	var arc = new ArcSolver(v[0], v[1], v[2]);

	var material2 = new THREE.MeshBasicMaterial({
		color: 0xffffff,
	});

	view.renderManager.onEnterFrame.add(function() {
		spin.rotation.y += .01;
	})

	var boxGeometry = new THREE.BoxGeometry(5, 1, 1, 1, 1, 1);

	var centerBall = new THREE.Mesh(sphereGeometry, material2);
	centerBall.position.copy(arc.center);
	centerBall.scale.set(.05, .05, .05);
	spin.add(centerBall);

	var arrow = new THREE.ArrowHelper(arc.normal, arc.center);
	spin.add(arrow);

	var arrowU = new THREE.ArrowHelper(arc.planeDirU, arc.center, 1, 0xff0000);
	spin.add(arrowU);
	var arrowV = new THREE.ArrowHelper(arc.planeDirV, arc.center, 1, 0x00ff00);
	spin.add(arrowV);

	var sampleMaterial = new THREE.MeshBasicMaterial({
		color: 0x0000ff
	});

	var lineBalls = [];
	for (var i = 0; i < 100; i++) {
		var ball = new THREE.Mesh(
			sphereGeometry, 
			sampleMaterial
		);
		ball.position.copy(arc.sample(i/100));
		ball.scale.set(.05, .05, .05);
		spin.add(ball);
		lineBalls.push(ball);
	};

	view.renderManager.onEnterFrame.add(function() {
		var time = (new Date()).getTime() * .001;
		v[1].x = Math.sin(time) * 4;
		v[1].y = Math.cos(time) * 4;
		v[1].z = Math.sin(time * 1.3) * 4;
		arc.update();
		for (var i = 0; i < lineBalls.length; i++) {
			lineBalls[i].position.copy(arc.sample(i/100));
		};

		for (var i = 0; i < vertBalls.length; i++) {
			vertBalls[i].position.copy(v[i]);
		};
		centerBall.position.copy(arc.center);
		arrowU.setDirection(arc.planeDirU);
		arrowU.position.copy(arc.center);
		arrowV.setDirection(arc.planeDirV);
		arrowV.position.copy(arc.center);
		arrow.setDirection(arc.normal);
		arrow.position.copy(arc.center);
	})

	var planeMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(8, 8, 8, 8),
		new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x7f7f7f
		})
	)
	planeMesh.rotation.x += Math.PI * .5;
	spin.add(planeMesh);
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);