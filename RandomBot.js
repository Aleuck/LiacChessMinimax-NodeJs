(function (exports) {
	var extend = require('./extend.js').extend;
	var LiacBot = require('./base_client.js').LiacBot;

	var Color = {
		WHITE : 1,
		BLACK : -1
	}

	extend(
		LiacBot,
		function () {},
		{
			name: 'Random Bot',
			onMove: null
		}
	);
	console.log(exports);
}(exports));

var main = function(){
    console.log("randombot main execution");
}

if (require.main === module) {
    main();
}