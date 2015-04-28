var extend = require('./extend.js').extend,
    LiacBot = require('./base_client.js').LiacBot,
    child_process = require('child_process'),

    // Constants
    MINIMUM_DEPTH = 3,
    MAXIMUM_DEPTH = 6,

    // class LLBotMulti extends LiacBot // (base_client)
    LLBotMulti = extend(
        // Classe pai
        LiacBot,
        // Construtor
        function (botName) {
            this.botName = botName;
            this.lastMove = null;
            this.bots = [];
            this.turn = 1;
            var i;
            var that = this;
            this.startBots();
        },
        // Propriedades default e métodos
        {
            name: "LLBotMulti",
            onMove: function (state) {
                console.log("Generating a move... (orchestrator)");
                estimationCount = 0;
                if (state.bad_move) {
                    console.log(state);
                }

                state.lastMove = this.lastMove;

                // inicia o timer
                var onTimeout = this.onTimeout.bind(this);
                setTimeout(onTimeout,5500);

                // resetting moves
                this.moves = [];

                // manda estado pros processos de bot
                var i;
                for (i = MAXIMUM_DEPTH; i >= MINIMUM_DEPTH; i -= 1) {
                    this.bots[i].send(state);
                }
            },
            onMessage: function (data) {
                    console.log('message');
                    console.log(data);
                    this.moves[data.bot] = data;
            },
            onGameOver: function (state) {
                console.log('Game Over');
                console.log(state);
                console.log('---------');
            },
            onTimeout: function () {
                var move, i;
                console.log("time's up!");
                for (i = MAXIMUM_DEPTH; i >= MINIMUM_DEPTH; i -= 1) {
                    if (this.moves[i]) {
                        move = this.moves[i];
                        break;
                    }
                }
                this.sendMove(move.from, move.to);
                this.lastMove = move;
                this.killBots();
                this.startBots();
                console.log("Chosed move:")
                console.log("Move from [" + move.from.x + "][" + move.from.y + "] "+
                                   "to [" + move.to.x   + "][" + move.to.y   + "]");
            },
            killBots: function () {
                for (i = MINIMUM_DEPTH; i <= MAXIMUM_DEPTH; i += 1) {
                    this.bots[i].kill();
                    this.bots[i] = null;
                }
            },
            startBots: function () {
                var onMessage = this.onMessage.bind(this);
                for (i = MINIMUM_DEPTH; i <= MAXIMUM_DEPTH; i += 1) {
                    this.bots[i] = child_process.fork(this.botName, [i]);
                    this.bots[i].on('message', onMessage);
                }
            }
        }
    );
exports.LLBotMulti = LLBotMulti;



//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function main() {
    var bot = new LLBotMulti('LLBotMultiBot'),
        portIdx = process.argv.indexOf("-p"),
        hostIdx = process.argv.indexOf("-h"),
        port,
        host;
    if (process.argv.indexOf("--help") !== -1) {
        console.log("Usage: node LLBotMultiOrchestrator.js [-p PORT] [-h HOST]");
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
