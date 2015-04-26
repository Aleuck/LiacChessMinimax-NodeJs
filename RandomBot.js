(function (exports) {
    'use strict';
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
                name: "Random Bot",
                onMove: function (state) {
                    console.log(state.board);
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
                    this.sendMove(move.from, move.to);
                },
                onGameOver: function (state) {
                    console.log('Game Over');
                    console.log(state);
                    console.log('---------');
                }
            }
        );
    exports.RandomBot = RandomBot;


    //////////////////////////////////////////////////
    // Main (para quando é executado diretamente)
    //////////////////////////////////////////////////

    function main() {
        var bot = new RandomBot(),
            portIdx = process.argv.indexOf("-p"),
            hostIdx = process.argv.indexOf("-h"),
            port,
            host;
        if (process.argv.indexOf("--help") !== -1) {
            console.log("Usage: node RandomBot.js [-p PORT] [-h HOST]");
            process.exit();
        }
        if (portIdx > 0) {
            port = parseInt(process.argv[portIdx + 1], 10);
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

}(exports));
