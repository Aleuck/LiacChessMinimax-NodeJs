(function (exports) {
	var net = require('net');

	function LiacBot() {
		// Constructor.
		var that = this;
		this._socket = new net.Socket();
		this._socket.on('data', function (data) {
			console.log(data.toString());
			that._receiveState(JSON.parse(data.toString()));
		})
	}
	LiacBot.prototype = {
		// Proprieties
		name: 'Liac Bot',
		ip: '127.0.0.1',
		port: 50100,
		// Internal methods
		_connect: function () {
			this._socket.connect(this.port, this.ip);
		},
		_sendData: function (data) {
			var message = JSON.stringify(data);
			this._socket.write(message);
		},
		_sendName: function () {
			this._sendData({
				name : this.name
			});
		},
		_receiveState: function (state) {
			if (state['winner'] != 0 || state['draw']) {
				this.onGameOver(state);
			} else {
				this.onMove(state);
			}
		},
		// interface
		sendMove: function (from_, to_) {
			this._sendData({
				'from': from_,
				'to': to_
			});
		},
		onMove: function () {},
		onGameOver: function (state) {},
		start: function () {
			this._connect();
			this._sendName();
		}
	}

	// exports
	exports.LiacBot = LiacBot;
}(exports));

var main = function(){
	var LiacBot = exports.LiacBot;
	var bot = new LiacBot();
	var portIdx = process.argv.indexOf("-p");
	var hostIdx = process.argv.indexOf("-h");
	var port;
	var host;
	if (portIdx > 0) {
		port = parseInt(process.argv[portIdx+1]);
	}
	if (hostIdx > 0) {
		host = process.argv[hostIdx+1];
	}
	if (port) {
		bot.port = port;
	}
	if (host) {
		bot.ip = host;
	}
	bot.start();
}

if (require.main === module) {
    main();
}