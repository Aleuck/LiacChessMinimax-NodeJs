
(function (exports) {
    'use strict';
    var Team = {
            WHITE : 1,
            BLACK : -1
        };

    function insideBoard(x, y) {
        return (x >= 0 && x <= 7 && y >= 0 && y <= 7);
    }

    function pieceType(piece) { // ADJUST IN BOTH FILES WHEN ADDING NEW PIECES
        if (piece === 'P') return 'p';
        if (piece === 'Q') return 'q';
        if (piece === 'N') return 'n';
        return piece;
    }

    function pieceTeam(piece) {
        return (piece < 'a' ? Team.WHITE : Team.BLACK); // UPPER : lower
    }

    
    
    
    //////////////////////////////////////////////////
    // Classe Board
    //////////////////////////////////////////////////
    
    // Construtor
    function Board(state) {
        this.cells = [[], [], [], [], [], [], [], []];
        this.whoMoves = state.who_moves;
        this.myPieces = [];
        this.moves = [];
        var c = state.board,
            i = 0,
            x, y;
        this.enpassant = state.enpassant ? { x: state.enpassant[1], y: state.enpassant[0] } : false;
        // Leitura do tabuleiro recebido
        for (y = 7; y >= 0; y -= 1) {
            for (x = 0; x < 8; x += 1) {
                if (c[i] !== '.') {
                    this.cells[x][y] = c[i]; // TIREI O MYPIECES AQUI
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
        pieceGenerate: function (piece, x, y) {
            switch(pieceType(piece)) {
                case 'p':
                    this.pawnGenerate(x, y);
                    break;
                case 'n':
                    this.knightGenerate(x, y);
                    break;
                case 'q':
                    this.queenGenerate(x, y);
                    break;
            }
        },
        generate: function () {
            var x, y, piece;
            this.moves = [];
            
            // For each board place
            for (x = 0; x < 8; x += 1) { // TIREI O MYPIECES AQUI, REFATOREI AFU
                for (y = 0; y < 8; y += 1) {
                    piece = this.cells[x][y];
                    
                    // If place has piece and piece's team is the moving team
                    if (piece && pieceTeam(piece) === this.whoMoves) {
                        this.pieceGenerate(piece, x, y);
                    }
                }
            }
            
            if (this.enpassant) {
                //console.log('en passant!!!');
                //console.log(this.enpassant);
                x = this.enpassant.x;
                y = this.enpassant.y;
                if (y === 5) {
                    // black pawn moved 2 squares check for white pawns who can capture it en passant
                    y = 4;
                    x += 1;
                    if (x < 8) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece === 'P') { // White pawn
                            this.moves.unshift({ from: { x : x, y : y }, to: this.enpassant, enpassant: true });
                        }
                    }
                    x -= 2;
                    if (x >= 0) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece === 'P') { // White pawn
                            this.moves.unshift({ from: { x : x, y : y }, to: this.enpassant, enpassant: true });
                        }
                    }
                } else {
                    // white pawn moved 2 squares check for black pawns who can capture it en passant
                    y = 3;
                    x += 1;
                    if (x < 8) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece === 'p') { // Black pawn
                            this.moves.unshift({ from: { x : x, y : y }, to: this.enpassant, enpassant: true });
                        }
                    }
                    x -= 2;
                    if (x >= 0) {
                        //console.log(x, y);
                        piece = this.cells[x][y];
                        if (piece === 'p') { // Black pawn
                            this.moves.unshift({ from: { x : x, y : y }, to: this.enpassant, enpassant: true });
                        }
                    }
                }
            }
            return this.moves;
        },
        afterMove: function (move) {

            // Create new board (inherits from this board)
            var newBoard = Object.create(this),
                piece;
            
            // Copy cells array
            newBoard.cells = this.cells.map(function (arr) {
                return arr.slice();
            });

            // Copy piece to be moved
            piece = newBoard.cells[move.from.x][move.from.y];

            // Place copied piece in new position
            newBoard.cells[move.to.x][move.to.y] = piece;

            // Remove old piece from cells array
            delete newBoard.cells[move.from.x][move.from.y];
            
            // Remove enpassant
            if (move.enpassant && pieceType(piece) === 'p') {
                // Remove a peça da coluna para onde ela foi, na linha onde a peça estava
                delete newBoard.cells[move.to.x][move.from.y];
            }

            // Change player to opposite player
            newBoard.whoMoves = -this.whoMoves;

            // movement generates an enpassant?
            newBoard.enpassant = move.enpassant || null;
            
            return newBoard;
        },
        isTerminal : function () {
            var x, y, p, p1, p2,
                blackPawnsCount,
                whitePawnsCount;
            // Check pawns on first and last rows
            for (x = 0; x < 8; x += 1) {

                // Check pieces on first and last rows
                p1 = this.cells[x][0];
                p2 = this.cells[x][7];

                // If piece is a pawn, board is terminal
                if ((p1 && p1.type === 'p') || (p2 && p2.type === 'p')) {
                    return true;
                }
            }

            // Check if either player has no more pawns
            blackPawnsCount = 0;
            whitePawnsCount = 0;
            for (x = 0; x < 8; x += 1) {
                for (y = 0; y < 8; y += 1) {
                    p = this.cells[x][y];
                    if (p && p.type === 'p') {
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
            var x, y, line, p, print;
            print = (this.whoMoves === Team.BLACK ? "Black moves:\n" : "White moves:\n");
            print += "-----------------\n";
            for (y = 0; y < 8; y += 1) {
                line = "|";
                for (x = 0; x < 8; x += 1) {
                    p = this.cells[x][y];
                    line += p ? p : ' ';
                    line += '|';
                }
                print += line + "\n";
                print += "-----------------\n";
            }
            console.log(print);
        },
        
        
        
        //////////////////////////////////////////////////
        // Classe Pawn
        //////////////////////////////////////////////////

        pawnGenerate: function (myX, myY) {
            var x, y,
                d = this.team,
                piece;

            x = myX;

            // movement to 1 forward
            y = myY + d;
            if (!this.cells[x][y]) {
                // movement to 2 forward
                this.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                if (d === 1) { // if white
                    if (myY === 1) {
                        if (!this.cells[x][3]) {
                            this.moves.unshift({ from: { x: myX, y: myY }, to: {x: x, y: 3}, enpassant: { x: x, y: 2 } });
                        }
                    }
                } else {
                    if (myY === 6) {
                        if (!this.cells[x][4]) {
                            this.moves.unshift({ from: { x: myX, y: myY }, to: {x: x, y: 4}, enpassant: { x: x, y: 5 } });
                        }
                    }
                }
            }

            // normal capture to right
            x = myX + 1;
            if (insideBoard(x, y)) {
                piece = this.cells[x][y];
                if (piece && this.isOpponent(piece)) {
                    this.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                }
            }

            // normal capture to left
            x = myX - 1;
            if (insideBoard(x, y)) {
                piece = this.cells[x][y];
                if (piece && this.isOpponent(piece)) {
                    this.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                }
            }
        },


        
        //////////////////////////////////////////////////
        // Classe Knight
        //////////////////////////////////////////////////

        knightGen: function (myX, myY, x, y) {
            // if valid position
            if (insideBoard(x, y)) {
                var piece = this.cells[x][y];
                if (!piece) {
                    this.moves.push({from: { x: myX, y: myY }, to: { x: x, y: y }});
                } else if (this.isOpponent(piece)) {
                    this.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                }
            }
        },

        knightGenerate: function (myX, myY) {
            this.knightGen(myX, myY, myX + 1, myY + 2);
            this.knightGen(myX, myY, myX + 1, myY - 2);
            this.knightGen(myX, myY, myX - 1, myY + 2);
            this.knightGen(myX, myY, myX - 1, myY - 2);
            this.knightGen(myX, myY, myX + 2, myY + 1);
            this.knightGen(myX, myY, myX + 2, myY - 1);
            this.knightGen(myX, myY, myX - 2, myY + 1);
            this.knightGen(myX, myY, myX - 2, myY - 1);
        },



        //////////////////////////////////////////////////
        // Classe Queen
        //////////////////////////////////////////////////

        queenGen: function (myX, myY, xDir, yDir) {
            var x = myX,
                y = myY,
                piece;

            x += xDir;
            y += yDir;

            // While inside board
            while (insideBoard(x, y)) {

                // If position has piece
                piece = this.cells[x][y];
                if (piece) {
                    if (this.isOpponent(piece))
                        this.moves.unshift({from: { x: myX, y: myY }, to: { x: x, y: y }});
                    break;
                }

                // Add free position, go to next position
                this.moves.push({from: { x: myX, y: myY }, to: { x: x, y: y }});
                x += xDir;
                y += yDir;
            }
        },

        queenGenerate: function (myX, myY) {
            // Eight directions, counter-clockwise
            this.queenGen(myX, myY,  1,  0);
            this.queenGen(myX, myY,  1,  1);
            this.queenGen(myX, myY,  0,  1);
            this.queenGen(myX, myY, -1,  1);
            this.queenGen(myX, myY, -1,  0);
            this.queenGen(myX, myY, -1, -1);
            this.queenGen(myX, myY,  0, -1);
            this.queenGen(myX, myY,  1, -1);
        }
    }; // end Board.prototype
    
    
    exports.Board = Board;
}(exports));