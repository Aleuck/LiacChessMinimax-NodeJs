// Implementation of class extension (constructor reuse)
(function (exports) {
    'use strict';
    function extend(Parent, Child, proprieties) {
        // make a new constructor that calls parent's then child's consctructors.
        function Constructor() {
            if (Parent) { Parent.apply(this, arguments); }
            if (Child) { Child.apply(this, arguments); }
        }
        // new prototype inherits from Parent's
        var prototype = Object.create(Parent.prototype),
        // copy proprieties to new prototype
            keys = Object.keys(proprieties);
        keys.forEach(function (key) {
            prototype[key] = proprieties[key];
        });
        // assign prototype to constructor;
        Constructor.prototype = prototype;
        // return the constructor
        return Constructor;
    }
    exports.extend = extend;
}(exports));