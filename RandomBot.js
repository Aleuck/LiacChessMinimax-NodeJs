(function (exports) {
    var extend = require('./extend.js').extend;
    var LiacBot = require('./base_client.js').LiacBot;

    var Color = {
        WHITE : 1,
        BLACK : -1
    }
    // class RandomBot extends LiacBot // (base_client)
    var RandomBot = extend(
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
                // TODO: needs pieces implementation
            }
        }
    );
    console.log(exports);
}(exports));

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
        return;
    },
    isOpponent: function (piece) {
        return (piece && piece.team != self.team);
    }
}



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
                pos = {}, piece;
            
            // movement to 1 forward
            pos.x = myX + d;
            pos.y = myY;
            if (this.board.is_empty(pos)) {
                moves.push(pos);
            }
            
            // normal capture to right
            pos.y = myY + 1;
            piece = this.board[pos.x][pos.y];
            if (this.is_opponent(piece)) {
                moves.push(pos);
            }
            
            // normal capture to left
            pos.y = myY - 1;
            piece = this.board[pos.x][pos.y];
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
                piece = this.board[x][y];
                
                if (!piece || this.isOpponent(piece)) {
                    moves.push({x:x, y:y}));
                }
            }
        }
        ,
        'generate' : function () {
            var moves = [];
            var myX = this.position.x;
            var myY = this.position.y;
            
            this._gen(moves, myX+1, myY+2);
            this._gen(moves, myX+1, myY-2);
            this._gen(moves, myX-1, myY+2);
            this._gen(moves, myX-1, myY-2);
            this._gen(moves, myX+2, myY+1);
            this._gen(moves, myX+2, myY-1);
            this._gen(moves, myX-2, myY+1);
            this._gen(moves, myX-2, myY-1);
            
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
    function(board, team, position) {
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
                if (board[x][y]) {
                    if (this.isOpponent(board[i][j])) {
                        moves.push({x:i,y:j})
                    }
                    break;
                }
                
                // Add free position, go to next position
                moves.push({x:i,y:j});
                x += xDir;
                y += yDir;
            }
        }
        
        'generate' : function () {
            var moves = [];
            var myX = this.position.x;
            var myY = this.position.y;
            
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
function Board() {
    this.cells = [[],[],[],[],[],[],[],[]];
    var PIECES = {
        'p': Pawn,
        'q': Queen,
        'n': Knight
    };
    
    var my_team = state['who_moves'];
    var c = state['board'];
    var i = 0;
    var x, y, cls, team, piece;
    for (x = 0; x < 8; x += 1) {
        for (y = 0; y < 8; y += 1) {
            if (c[i] != '.') {
                cls = PIECES[c[i].toLowerCase()];
            }
            i += 1;
        }
    }
}
// Propriedades default e métodos
Board.prototype = {
}



//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

var main = function(){
    console.log("randombot main execution");
}

if (require.main === module) {
    main();
}