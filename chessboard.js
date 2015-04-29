(function (exports) {
    'use strict';
    var extend = require('./extend.js').extend,
        Team = {
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
    function Piece(board, team, position) {
        this.board = board;
        this.team = team;
        this.position = position;
    }
    // Propriedades default e métodos
    Piece.prototype = {
        board: null,
        team: null,
        position: null,
        type: '*',
        generate: function () {
            return [];
        },
        isOpponent: function (piece) {
            return (piece.team !== this.team);
        }
    };


    //////////////////////////////////////////////////
    // Classe Pawn
    //////////////////////////////////////////////////

    var Pawn = extend(
        // Classe pai
        Piece,
        // Construtor
        function () {},
        // Propriedades default e métodos
        {
            'type' : 'p',
            'generate' : function () {
                var myX = this.position.x,
                    myY = this.position.y,
                    d = this.team,
                    x,
                    y,
                    piece;

                x = myX;

                // movement to 2 forward
                if (d === 1) { // if white
                    if (myY === 1) {
                        if (!this.board.cells[x][3]) {
                            this.board.moves.unshift({ from: { x: myX, y: myY }, to: {x: x, y: 3}, enpassant: { x: x, y: 2 } });
                        }
                    }
                } else {
                    if (myY === 6) {
                        if (!this.board.cells[x][4]) {
                            this.board.moves.unshift({ from: { x: myX, y: myY }, to: {x: x, y: 4}, enpassant: { x: x, y: 5 } });
                        }
                    }
                }

                // movement to 1 forward
                y = myY + d;
                if (!this.board.cells[x][y]) {
                    this.board.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                }

                // normal capture to right
                x = myX + 1;
                if (insideBoard(x, y)) {
                    piece = this.board.cells[x][y];
                    if (piece && this.isOpponent(piece)) {
                        this.board.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                    }
                }

                // normal capture to left
                x = myX - 1;
                if (insideBoard(x, y)) {
                    piece = this.board.cells[x][y];
                    if (piece && this.isOpponent(piece)) {
                        this.board.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                    }
                }
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
        function () {},
        // Propriedades default e métodos
        {
            'type' : 'n',
            '_gen' : function (x, y) {
                // if valid position
                if (insideBoard(x, y)) {
                    var piece = this.board.cells[x][y];
                    if (!piece) {
                        this.board.moves.push({from: { x: this.position.x, y: this.position.y }, to: { x: x, y: y }});
                    } else if (this.isOpponent(piece)) {
                        this.board.moves.unshift({from: { x: this.position.x, y: this.position.y }, to: { x: x, y: y }});
                    }
                }
            },
            'generate' : function () {
                var myX = this.position.x,
                    myY = this.position.y;
                this._gen(myX + 1, myY + 2);
                this._gen(myX + 1, myY - 2);
                this._gen(myX - 1, myY + 2);
                this._gen(myX - 1, myY - 2);
                this._gen(myX + 2, myY + 1);
                this._gen(myX + 2, myY - 1);
                this._gen(myX - 2, myY + 1);
                this._gen(myX - 2, myY - 1);
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
        function () {},
        // Propriedades default e métodos
        {
            'type' : 'q',
            '_gen' : function (x, y, xDir, yDir) {
                var piece;
                var myX = this.position.x,
                    myY = this.position.y;
                x += xDir;
                y += yDir;
                // While inside board
                while (insideBoard(x, y)) {
                    // If position has piece
                    piece = this.board.cells[x][y];
                    if (piece) {
                        if (this.isOpponent(piece)) {
                            this.board.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                        }
                        break;
                    }
                    // Add free position, go to next position
                    this.board.moves.push({from: { x: myX, y: myY }, to: { x: x, y: y }});
                    x += xDir;
                    y += yDir;
                }
            },
            'generate' : function () {
                var myX = this.position.x,
                    myY = this.position.y;
                // Eight directions, counter-clockwise
                this._gen(myX, myY,  1,  0);
                this._gen(myX, myY,  1,  1);
                this._gen(myX, myY,  0,  1);
                this._gen(myX, myY, -1,  1);
                this._gen(myX, myY, -1,  0);
                this._gen(myX, myY, -1, -1);
                this._gen(myX, myY,  0, -1);
                this._gen(myX, myY,  1, -1);
            }
        }
    );


    //////////////////////////////////////////////////
    // Classe Board
    //////////////////////////////////////////////////

    // Construtor
    function Board(state) {
        this.cells = [[], [], [], [], [], [], [], []];
        this.whoMoves = state.who_moves;
        this.myPieces = [];
        this.moves = [];
        var PIECES = {
            p: Pawn,
            q: Queen,
            n: Knight
        },
            my_team = state.who_moves,
            c = state.board,
            i = 0,
            x, y, ch, PieceType, team, piece;
        this.enpassant = state.enpassant ? { x: state.enpassant[1], y: state.enpassant[0] } : false;
        for (y = 7; y >= 0; y -= 1) {
            for (x = 0; x < 8; x += 1) {
                if (c[i] !== '.') {
                    ch = c[i].toLowerCase();
                    PieceType = PIECES[ch];
                    team = ch === c[i] ? Team.BLACK : Team.WHITE;
                    piece = new PieceType(this, team, { x: x, y: y });
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
            return (!this.cells[pos.x][pos.y]);
        },
        generate: function () {
            this.moves = [];
            this.myPieces.forEach(function (piece) {
                piece.generate();
            });
            if (this.enpassant) {
                //console.log('en passant!!!');
                //console.log(this.enpassant);
                var piece, x = this.enpassant.x, y = this.enpassant.y;
                if (y === 5) {
                    // black pawn moved 2 squares check for white pawns who can capture it en passant
                    y = 4;
                    x += 1;
                    if (x < 8) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece && piece.type === 'p') {
                            if (piece.team === Team.WHITE) {
                                this.moves.unshift({ from: piece.position, to: this.enpassant, enpassant: true });
                            }
                        }
                    }
                    x -= 2;
                    if (x >= 0) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece && piece.type === 'p') {
                            if (piece.team === Team.WHITE) {
                                this.moves.unshift({ from: piece.position, to: this.enpassant, enpassant: true });
                            }
                        }
                    }
                } else {
                    // white pawn moved 2 squares check for black pawns who can capture it en passant
                    y = 3;
                    x += 1;
                    if (x < 8) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece && piece.type === 'p') {
                            if (piece.team === Team.BLACK) {
                                this.moves.unshift({ from: piece.position, to: this.enpassant, enpassant: true });
                            }
                        }
                    }
                    x -= 2;
                    if (x >= 0) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece && piece.type === 'p') {
                            if (piece.team === Team.BLACK) {
                                this.moves.unshift({ from: piece.position, to: this.enpassant, enpassant: true });
                            }
                        }
                    }
                }
            }
            return this.moves;
        },
        afterMove: function (move) {

            // Create new board (inherits from this board)
            var newBoard = Object.create(this);
            //this.print();
            // Copy cells array
            newBoard.cells = this.cells.map(function(arr) {
                return arr.map(function (p) {
                    if (p) {
                        var newPiece = Object.create(p);
                        newPiece.board = newBoard;
                        return newPiece;
                    } else {
                        return undefined;
                    }
                });
            });

            // Copy piece to be moved
            var piece = newBoard.cells[move.from.x][move.from.y];

            // Place copied piece in new position
            piece.position = { x: move.to.x, y: move.to.y };
            piece.board = newBoard;
            newBoard.cells[move.to.x][move.to.y] = piece;

            // Remove old piece from cells array
            delete newBoard.cells[move.from.x][move.from.y];

            // Remove enpassant
            if (move.enpassant && piece.type === 'p') {
                delete newBoard.cells[move.to.x][move.from.y];
            }

            // Change player to opposite player
            newBoard.whoMoves = -this.whoMoves;
            newBoard.myPieces = [];

            // Update myPieces to opposite player
            var x, y, p;
            for (x = 0; x < 8; x += 1) {
                for (y = 0; y < 8; y += 1) {
                    p = newBoard.cells[x][y];
                    // diz que cells é undefined
                    if (p && p.team === newBoard.whoMoves) {
                        newBoard.myPieces.push(p);
                    }
                }
            }

            // movement generates an enpassant?
            newBoard.enpassant = move.enpassant || null;
            //newBoard.print();
            //console.log("\n\n\n\n");
            return newBoard;
        },
        isTerminal : function () {
            var x, y, p, p1, p2;
            // Check pawns on first and last rows
            for (x = 0; x < 8; x += 1) {
                
                // Check pieces on first and last rows
                p1 = this.cells[x][0];
                p2 = this.cells[x][7];
                
                // If piece is a pawn, board is terminal
                if ((p1 && p1.type == 'p') || (p2 && p2.type == 'p')) {
                    return true;
                }
            }
            
            // Check if either player has no more pawns
            var blackPawnsCount = 0;
            var whitePawnsCount = 0;
            for (x = 0; x < 8; x += 1) {
                for (y = 0; y < 8; y += 1) {
                    p = this.cells[x][y];
                    if (p && p.type == 'p') {
                        switch (p.team) {
                            case Team.WHITE:
                                whitePawnsCount += 1;
                                break;
                            case Team.BLACK:
                                blackPawnsCount += 1;
                                break;
                        }
                        
                        if (whitePawnsCount > 0 && blackPawnsCount > 0) {
                            return false;
                        }
                    }
                }
            }
            
            return true;
        },
        print: function () {
            var x, y, line, c, p, print;
            print = "-----------------\n";
            for (y = 0; y < 8; y += 1) {
                line = "|";
                for (x = 0; x < 8; x += 1) {
                    p = this.cells[x][y];
                    if (p) {
                        if (p.team === Team.WHITE) {
                            c = p.type.toUpperCase();
                        } else {
                            c = p.type;
                        }
                    }
                    line += p ? c : ' ';
                    line += '|';
                }
                print += line;
                print += "\n-----------------\n";
            }
            line = 'MyPieces: ';
            for (x = 0; x < this.myPieces.length; x += 1 ) {
                p = this.myPieces[x];
                line += p.team === 1 ? p.type : p.type.toUpperCase();
            }
            print += line;
            print += "\n-----------------";
            console.log(print);
        }
    };
    exports.Board = Board;
} (exports));