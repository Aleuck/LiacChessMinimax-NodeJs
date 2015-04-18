(function (exports) {
    var extend = require('./extend.js').extend,
        Board = require('./chess.js').board,
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
                        console.log(state.board);
                    }
                    moves = board.generate();
                    move = moves[Math.floor(Math.random() * moves.length)];
                    this.last_move = move;
                    //TODO: this.send_move();
                },
                onGameOver: function (state) {
                    console.log('Game Over');
                }
            }
        );
    exports.RandomBot = RandomBot;
}(exports));

function insideBoard(x, y) {
    return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
}

var Team = {
    WHITE : 1,
    BLACK : -1
};

//////////////////////////////////////////////////
// Classe Piece
//////////////////////////////////////////////////

// Construtor
function Piece() {
    this.board = null;
    this.team = null;
    this.position = null;
    this.type = null;
}
// Propriedades default e métodos
Piece.prototype = {
    generate: function () {
        return;
    },
    isOpponent: function (piece) {
        return (piece && piece.team !== this.team);
    }
};



//////////////////////////////////////////////////
// Classe Pawn
//////////////////////////////////////////////////

var Pawn = extend(
    // Classe pai
    Piece,
    // Construtor
    function (board, team, position) {
        this.board = board;
        this.team = team;
        this.position = position;
    },
    // Propriedades default e métodos
    {
        'generate' : function () {
            var moves = [],
                myX = this.position.x,
                myY = this.position.y,
                d = this.team,
                pos = {},
                piece;

            // movement to 1 forward
            pos.x = myX + d;
            pos.y = myY;
            if (this.board.isEmpty(pos)) {
                moves.push(pos);
            }

            // normal capture to right
            pos.y = myY + 1;
            piece = this.board.cells[pos.x][pos.y];
            if (this.is_opponent(piece)) {
                moves.push(pos);
            }

            // normal capture to left
            pos.y = myY - 1;
            piece = this.board.cells[pos.x][pos.y];
            if (this.is_opponent(piece)) {
                moves.push(pos);
            }

            return moves;
        }
    }
);



//////////////////////////////////////////////////
// Classe Knight
//////////////////////////////////////////////////

var Knight = extend(
    // Classe pai
    Piece,
    // Construtor
    function (board, team, position) {
        this.board = board;
        this.team = team;
        this.position = position;
    },
    // Propriedades default e métodos
    {
        '_gen' : function (moves, x, y) {
            // if valid position
            if (insideBoard(x, y)) {
                var piece = this.board.cells[x][y];
                if (!piece || this.isOpponent(piece)) {
                    moves.push({x: x, y: y});
                }
            }
        },
        'generate' : function () {
            var moves = [],
                myX = this.position.x,
                myY = this.position.y;
            this._gen(moves, myX + 1, myY + 2);
            this._gen(moves, myX + 1, myY - 2);
            this._gen(moves, myX - 1, myY + 2);
            this._gen(moves, myX - 1, myY - 2);
            this._gen(moves, myX + 2, myY + 1);
            this._gen(moves, myX + 2, myY - 1);
            this._gen(moves, myX - 2, myY + 1);
            this._gen(moves, myX - 2, myY - 1);
            return moves;
        }
    }
);



//////////////////////////////////////////////////
// Classe Queen
//////////////////////////////////////////////////

var Queen = extend(
    // Classe pai
    Piece,
    // Construtor
    function (board, team, position) {
        this.board = board;
        this.team = team;
        this.position = position;
    },
    // Propriedades default e métodos
    {
        '_gen' : function (moves, x, y, xDir, yDir) {
            x += xDir;
            y += yDir;
            // While inside board
            while (insideBoard(x, y)) {
                // If position has piece
                if (this.board.cells[x][y]) {
                    if (this.isOpponent(this.board.cells[x][y])) {
                        moves.push({x: x, y: y});
                    }
                    break;
                }
                // Add free position, go to next position
                moves.push({x: x, y: y});
                x += xDir;
                y += yDir;
            }
        },
        'generate' : function () {
            var moves = [],
                myX = this.position.x,
                myY = this.position.y;
            // Eight directions, counter-clockwise
            this._gen(moves, myX, myY,  1,  0);
            this._gen(moves, myX, myY,  1, -1);
            this._gen(moves, myX, myY,  0, -1);
            this._gen(moves, myX, myY, -1, -1);
            this._gen(moves, myX, myY, -1,  0);
            this._gen(moves, myX, myY, -1,  1);
            this._gen(moves, myX, myY,  0,  1);
            this._gen(moves, myX, myY,  1,  1);
        }
    }
);


//////////////////////////////////////////////////
// Classe Board
//////////////////////////////////////////////////

// Construtor
function Board(state) {
    this.cells = [[], [], [], [], [], [], [], []];
    this.myPieces = [];
    var PIECES = {
        p: Pawn,
        q: Queen,
        n: Knight
    },
        my_team = state.who_moves,
        c = state.board,
        i = 0,
        x, y, ch, cls, team, piece;
    for (x = 0; x < 8; x += 1) {
        for (y = 0; y < 8; y += 1) {
            if (c[i] !== '.') {
                ch = c[i].toLowerCase();
                cls = PIECES[ch];
                team = ch === c[i] ? Team.BLACK : Team.WHITE;
                piece = cls(this, team, { x : x, y : y });
                this.cells[x][y] = piece;
                if (team === my_team) {
                    this.my_pieces.push(piece);
                }
            }
            i += 1;
        }
    }
}
// Propriedades default e métodos
Board.prototype = {
    isEmpty: function (pos) {
        return !this.cells[pos.x][pos.y];
    },
    generate: function () {
        var moves = [];
        this.myPieces.forEach(function (piece) {
            var ms = piece.generate();
            ms.map(function (pos) { return [piece.position, pos]; });
            moves.push.apply(moves, ms);
        });
        return moves;
    }
};



//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function main() {
    console.log("randombot main execution");
}

if (require.main === module) {
    main();
}