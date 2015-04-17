// Implementation of class extension (constructor reuse)

function Extends(Parent,Child,proprieties) {
	function Constructor () {
		Parent.call(this);
		Child.call(this);
	}
	var prototype = Object.create(Parent.prototype);
	var keys = Object.keys(proprieties);
	keys.forEach(function(key){
		prototype[key] = proprieties[key];
	});
	Constructor.prototype = prototype;
	return Constructor;
}