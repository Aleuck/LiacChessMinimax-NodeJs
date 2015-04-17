(function (exports) {
	var net = require('net');

	function LiacBot() {
		// Constructor.
		var that = this;
		this._socket = new net.Socket();
		this._socket.on('data', function (data) {
			console.log(data);
			that._receiveData(data);
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
		_receiveData: function (data) {},
		_sendName: function () {
			this._sendData({
				name : this.name
			});
		},
		_receiveState: function () {

		},
		// interface
		sendMove: function () {},
		onMove: function () {},
		onGameOver: function () {},
		start: function () {
			this._connect();
			this._sendName();
		}
	}

	// exports
	exports.LiacBot = LiacBot;
}(exports));