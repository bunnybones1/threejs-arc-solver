var v1 = new THREE.Vector3();
var v2 = new THREE.Vector3();
var d31 = new THREE.Vector3();
var d21 = new THREE.Vector3();
var c1 = new THREE.Vector3();
var c2 = new THREE.Vector3();
var n = new THREE.Vector3();
var cross = new THREE.Vector3();
function ArcSolver(p1, p2, p3) {
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	this.points = [p1, p2, p3];
	this.center = new THREE.Vector3();
	this.planeDirU = new THREE.Vector3();
	this.planeDirV = new THREE.Vector3();
	this.plane = new THREE.Plane();
	this.normal = this.plane.normal;
	this.update();
}

ArcSolver.prototype = {
	update: function(){
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		var center = this.center;
		v1.subVectors(p1,p3);
		v2.subVectors(p2,p3);
		cross.crossVectors(v1,v2);
		var v1Len = v1.lengthSq();
		var v2Len = v2.lengthSq();
		var crossLen = cross.lengthSq();
		v2.multiplyScalar(v1Len);
		v1.multiplyScalar(v2Len);
		v2.sub(v1);
		center.crossVectors(v2,cross);
		center.multiplyScalar(1.0/(2.0*crossLen));
		center.add(p3);

		this.plane.setFromCoplanarPoints(p1, p2, p3);

		c1.subVectors(p1, center);
		c2.subVectors(p3, center);

		v1.subVectors(p1,p3);
		v2.subVectors(p2,p3);

		d31.subVectors(p3,p1);
		d21.subVectors(p2,p1);

		this.radius = c1.length();

		this.planeDirU.copy(c1).normalize();
	    var n = d31.cross(d21);
		this.planeDirV.copy(n.cross(c1).normalize());

		this.angle = Math.acos(c1.normalize().dot(c2.normalize()));

		if (d21.dot(v2) > 0) {
		    this.angle = Math.PI * 2 - this.angle;
		}
	},
	sample: function(t) {
		var x = t * this.angle;
        return this.center.clone().add(this.planeDirU.clone().multiplyScalar(this.radius * Math.cos(x))).add(this.planeDirV.clone().multiplyScalar(-this.radius * Math.sin(x)));
	}
}
module.exports = ArcSolver;