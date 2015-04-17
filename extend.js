// Implementation of class extension (constructor reuse)
(function (exports) {
	function extend(Parent,Child,proprieties) {
		// make a new constructor that calls parent's then child's consctructors.
		function Constructor () {
			Parent.call(this);
			Child.call(this);
		}
		// new prototype inherits from Parent's
		var prototype = Object.create(Parent.prototype);
		// copy proprieties to new prototype
		var keys = Object.keys(proprieties);
		keys.forEach(function(key){
			prototype[key] = proprieties[key];
		});
		// assign prototype to constructor;
		Constructor.prototype = prototype;
		// return the constructor
		return Constructor;
	}
	exports.extend = extend;
}(exports));