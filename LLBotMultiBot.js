var extend = require('./extend.js').extend,
    Board = require('./chessboard.js').Board,

    // Constants
    MINIMAX_DEPTH = 4,
    DRAW_SCORE = 100000000,
    PAWN_SCORE = [100, 120, 140, 170, 200, 230, Infinity],
    KNIGHT_SCORE = 200,
    QUEEN_SCORE = 500,
    estimationCount = 0,
    lastMove = null;

    Team = {
        WHITE : 1,
        BLACK : -1
    };
function chooseMove(board) {
    return minimax(board, MINIMAX_DEPTH, -Infinity, Infinity).move;
}
function minimax(board, depth, alpha, beta) {
    if (depth == 0 || board.isTerminal()) {
        if (depth == 0) {
            //console.log("minimax depth end");
        } else {
            //console.log("board is terminal");
        }
        return { value: estimateScore(board), move: null };
    }

    var bestValue, val;
    var bestMove = null;

    if (board.whoMoves === Team.WHITE) {
        // White moves, maximize value
        bestValue = -Infinity;

        // Generate all possible moves
        var possibleMoves = board.generate();

        // No possible moves, draw.
        if (possibleMoves.length === 0) {
            //console.log("no moves for white");
            return { value: board.whoMoves * DRAW_SCORE, move: null };
        }
        possibleMoves.every(function (move) {
            val = minimax(board.afterMove(move), depth-1, alpha, beta).value;
            if (val > alpha) {
                alpha = val;
            }
            if (bestMove == null) {
                bestMove = move;
            }
            if (val > bestValue) {
                bestValue = val;

                if (move)
                    bestMove = move;
            }
            if (beta <= alpha)
                return false; // Break 'every' loop

            return true;
        });
    }
    else {
        // Black moves, minimize value
        bestValue = Infinity;

        // Generate all possible moves
        var possibleMoves = board.generate();

        // No possible moves, draw.
        if (possibleMoves.length === 0) {
            //console.log("no moves for black");
            return { value: board.whoMoves * DRAW_SCORE, move: null };
        }
        possibleMoves.every(function (move) {
            val = minimax(board.afterMove(move), depth-1, alpha, beta).value;
            if (val < beta) {
                beta = val;
            }
            if (bestMove == null) {
                bestMove = move;
            }
            if (val < bestValue) {
                bestValue = val;

                if (move)
                    bestMove = move;
            }
            if (beta <= alpha)
                return false; // Break 'every' loop

            return true;
        });
    }

    //console.log("a minimax chosen step successful");
    return { value: bestValue, move: bestMove};
}

function estimateScore(board) {
    var score = 0;

    // Counts number of white pieces minus black pieces
    var x, y, p, pawnDistance;
    for (x = 0; x < 8; x += 1) {
        for (y = 0; y < 8; y += 1) {
            p = board.cells[x][y];
            if (p) {
                if (p.type == 'p') { // Pawn
                    if (p.team === Team.WHITE) {
                        pawnDistance = y - 1;
                    } else {
                        pawnDistance = 6 - y;
                    }
                    score += p.team * PAWN_SCORE[pawnDistance];
                } else if (p.type == 'n') {
                    score += p.team * KNIGHT_SCORE;
                } else if (p.type == 'q') {
                    score += p.team * QUEEN_SCORE;
                }
            }
        }
    }
    estimationCount += 1;
    return score;
}

//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function onMove(state) {
    console.log("Generating a move... - child d_" + MINIMAX_DEPTH);
    estimationCount = 0;
    var board = new Board(state),
        moves,
        move;
    if (state.bad_move) {
        console.log(state);
    }
    //moves = board.generate();
    //move = moves[Math.floor(Math.random() * moves.length)];
    move = chooseMove(board);
    lastMove = move;
    console.log("Number of estimations: " + estimationCount);
    console.log("Move from [" + move.from.x + "][" + move.from.y + "] "+
                       "to [" + move.to.x   + "][" + move.to.y   + "]");
    move.bot = MINIMAX_DEPTH;
    process.send(move);
}

function main() {
    if (process.argv[2]) {
        MINIMAX_DEPTH = parseInt(process.argv[2], 10);
    }
    process.on('message', onMove)
}

if (require.main === module) {
    main();
}
