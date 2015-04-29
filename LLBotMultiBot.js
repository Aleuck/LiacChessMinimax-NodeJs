var extend = require('./extend.js').extend,
    Board = require('./chessboard.js').Board,

    // Constants
    MINIMAX_DEPTH = 3,
    DRAW_SCORE = 100000000,
    PAWN_SCORE = [100, 120, 140, 170, 200, 230, Infinity],
    PAWN_COUNT_SCORE = [-Infinity, 0, 0, 0, 0, 0, 0, 0, 0], // Negative
    KNIGHT_SCORE = 200,
    QUEEN_SCORE = 500,
    estimationCount = 0,
    lastMove = null;
    randomFactor = 1,

    Team = {
        WHITE : 1,
        BLACK : -1
    };
function chooseMove(board) {
    return minimax(board, MINIMAX_DEPTH, -Infinity, Infinity);
}
function minimax(board, depth, alpha, beta) {
    if (depth === 0 || board.isTerminal()) {
        return { value: estimateScore(board), move: null };
    }

    var bestValue;
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
            var val = minimax(board.afterMove(move), depth-1, alpha, beta).value;
            if (val > alpha) {
                alpha = val;
            }
            if (bestMove === null) {
                bestMove = move;
            }
            if (val > bestValue) {
                bestValue = val;
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
            var val = minimax(board.afterMove(move), depth-1, alpha, beta).value;
            if (val < beta) {
                beta = val;
            }
            if (bestMove === null) {
                bestMove = move;
            }
            if (val < bestValue) {
                bestValue = val;
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
    var x, y, p, pawnDistance, nWhitePawns = 0, nBlackPawns = 0;
    for (x = 0; x < 8; x += 1) {
        for (y = 0; y < 8; y += 1) {
            p = board.cells[x][y];
            if (p) {
                if (p.type === 'p') { // Pawn
                    if (p.team === Team.WHITE) {
                        pawnDistance = y - 1;
                        nWhitePawns += 1;
                    } else {
                        pawnDistance = 6 - y;
                        nBlackPawns += 1;
                    }
                    score += p.team * PAWN_SCORE[pawnDistance];
                } else if (p.type === 'n') {
                    score += p.team * KNIGHT_SCORE;
                } else if (p.type === 'q') {
                    score += p.team * QUEEN_SCORE;
                }
            }
        }
    }
    score += PAWN_COUNT_SCORE[nWhitePawns];
    score -= PAWN_COUNT_SCORE[nBlackPawns];
    estimationCount += 1;
    return score + (Math.random() * 2 - 1) * randomFactor;
}

function onMove(state) {
    console.log("Generating a move... -- child with depth " + MINIMAX_DEPTH);
    estimationCount = 0;
    var board = new Board(state),
        move;
    lastMove = state.lastMove;
    randomFactor = state.randomFactor;
    result = chooseMove(board);
    console.log("Number of estimations: " + estimationCount);
    console.log("Move from [" + result.move.from.x + "][" + result.move.from.y + "] "+
                       "to [" + result.move.to.x   + "][" + result.move.to.y   + "]");
    result.bot = MINIMAX_DEPTH;
    process.send(result);
}

//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function main() {
    if (process.argv[2]) {
        MINIMAX_DEPTH = parseInt(process.argv[2], 10);
    }
    process.on('message', onMove)
}

if (require.main === module) {
    main();
}
