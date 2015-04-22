(function (exports) {
    var extend = require('./extend.js').extend,
        Board = require('./chessboard.js').Board,
        LiacBot = require('./base_client.js').LiacBot,
        // class RandomBot extends LiacBot // (base_client)
        RandomBot = extend(
            // Classe pai
            LiacBot,
            // Construtor
            function () {
                this.lastMove = null;
            },
            // Propriedades default e métodos
            {
                name: "Felipe & Leuck's Random Bot",
                onMove: function (state) {
                    console.log("Generating a move...");
                    var board = new Board(state),
                        moves,
                        move;
                    if (state.bad_move) {
                        console.log(state);
                    }
                    moves = board.generate();
                    move = moves[Math.floor(Math.random() * moves.length)];
                    this.last_move = move;
                    this.sendMove(move[0],move[1]);
                },
                onGameOver: function (state) {
                    console.log('Game Over');
                }
            }
        );
    exports.RandomBot = RandomBot;
}(exports));



//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function main() {
    var RandomBot = exports.RandomBot;
    var bot = new RandomBot();
    var portIdx = process.argv.indexOf("-p");
    var hostIdx = process.argv.indexOf("-h");
    var port;
    var host;
    if (process.argv.indexOf("--help") !== -1) {
        console.log("Usage: node RandomBot.js [-p PORT] [-h HOST]");
        process.exit();
    }
    if (portIdx > 0) {
        port = parseInt(process.argv[portIdx + 1]);
    }
    if (hostIdx > 0) {
        host = process.argv[hostIdx + 1];
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
