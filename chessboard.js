(function (exports) {
    var extend = require('./extend.js').extend;
    var Team = {
        WHITE : 1,
        BLACK : -1
    };

    function insideBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }


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
            return [];
        },
        isOpponent: function (piece) {
            return (piece.team === -this.team);
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
                    x,
                    y,
                    piece;

                // movement to 1 forward
                x = myX + d;
                y = myY;
                if (!this.board.cells[x][y]) {
                    moves.push({ x: x, y: y });
                }

                // normal capture to right
                y = myY + 1;
                if (insideBoard(x, y)) {
                    piece = this.board.cells[x][y];
                    if (piece && this.isOpponent(piece)) {
                        moves.push({ x: x, y: y });
                    }
                }

                // normal capture to left
                y = myY - 1;
                    if (insideBoard(x, y)) {
                    piece = this.board.cells[x][y];
                    if (piece && this.isOpponent(piece)) {
                        moves.push({ x: x, y: y });
                    }
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
                        moves.push({ x: x, y: y });
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
                var piece;
                x += xDir;
                y += yDir;
                // While inside board
                while (insideBoard(x, y)) {
                    // If position has piece
                    piece = this.board.cells[x][y];
                    if (piece) {
                        if (this.isOpponent(piece)) {
                            moves.push({ x: x, y: y });
                        }
                        break;
                    }
                    // Add free position, go to next position
                    moves.push({ x: x, y: y });
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
                return moves;
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
        for (x = 7; x >= 0; x -= 1) {
            for (y = 0; y < 8; y += 1) {
                if (c[i] !== '.') {
                    ch = c[i].toLowerCase();
                    cls = PIECES[ch];
                    team = ch === c[i] ? Team.BLACK : Team.WHITE;
                    piece = new cls(this, team, { x: x, y: y });
                    this.cells[x][y] = piece;
                    if (team === my_team) {
                        this.myPieces.push(piece);
                    }
                }
                i += 1;
            }
        }
    }
    // Propriedades default e métodos
    Board.prototype = {
        isEmpty: function (pos) {
            return (this.cells[pos.x][pos.y] == undefined);
        },
        generate: function () {
            var moves = [];
            this.myPieces.forEach(function (piece) {
                var ms = piece.generate();
                moves.push.apply(moves, ms.map(function (pos) { return { from: piece.position, to: pos }; }));
            });
            return moves;
        }
    };
    exports.Board = Board;
}(exports));