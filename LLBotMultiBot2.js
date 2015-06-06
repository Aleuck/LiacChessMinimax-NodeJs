(function () {
'use strict';
var extend = require('./extend.js').extend,
    Board = require('./chessboard2.js').Board,

    // Constants
    DRAW_SCORE = 100000000,

    PAWN_SCORE = [100, 120, 140, 180, 230, 280, Infinity],
    PAWN_COUNT_SCORE = [-Infinity, -250, -150, -100, -80, -60, -40, -20, -0], // Negative!
    KNIGHT_SCORE = 220,
    BISHOP_SCORE = 220,
    ROOK_SCORE = 300,
    QUEEN_SCORE = 500,

    CENTRAL_BONUS = 30,
    OUR_TEAM_BONUS = 40,

    // Globals
    minimaxDepth = 3,
    estimationCount = 0,
    lastMove = null,
    randomFactor = 1,
    ourTeam = 0,

    Team = {
        WHITE : 1,
        BLACK : -1
    };

function pieceType(piece) { // ADJUST IN BOTH FILES WHEN ADDING NEW PIECES
    if (piece === 'P') return 'p';
    if (piece === 'Q') return 'q';
    if (piece === 'R') return 'r';
    if (piece === 'B') return 'b';
    if (piece === 'N') return 'n';
    return piece;
}

function pieceTeam(piece) {
    return (piece < 'a' ? Team.WHITE : Team.BLACK); // UPPER : lower
}

function estimateScore(board) {
    var score = 0, x, y, piece, pType, pTeam, pawnDistance, nWhitePawns = 0, nBlackPawns = 0;
    // Counts number of white pieces minus black pieces
    for (x = 0; x < 8; x += 1) {
        for (y = 0; y < 8; y += 1) {
            piece = board.cells[x][y];
            if (piece) {
                
                pType = pieceType(piece);
                pTeam = pieceTeam(piece);
                
                if (piece === 'P') { // White pawn
                    pawnDistance = y - 1;
                    nWhitePawns += 1;
                    score += pTeam * PAWN_SCORE[pawnDistance];
                } else if (piece === 'p') { // Black pawn
                    pawnDistance = 6 - y;
                    nBlackPawns += 1;
                    score += pTeam * PAWN_SCORE[pawnDistance];
                } else if (pType === 'n') { // Knight
                    score += pTeam * KNIGHT_SCORE;
                    if (x > 1 && x < 6 && y > 1 && y < 6) {
                        score += pTeam * CENTRAL_BONUS;
                    }
                    if (pTeam === ourTeam) {
                        score += pTeam * OUR_TEAM_BONUS;
                    }
                } else if (pType === 'b') { // Knight
                    score += pTeam * BISHOP_SCORE;
                    if (x > 1 && x < 6 && y > 1 && y < 6) {
                        score += pTeam * CENTRAL_BONUS;
                    }
                    if (pTeam === ourTeam) {
                        score += pTeam * OUR_TEAM_BONUS;
                    }
                } else if (pType === 'r') { // Knight
                    score += pTeam * ROOK_SCORE;
                    if (x > 1 && x < 6 && y > 1 && y < 6) {
                        score += pTeam * CENTRAL_BONUS;
                    }
                    if (pTeam === ourTeam) {
                        score += pTeam * OUR_TEAM_BONUS;
                    }
                } else if (pType === 'q') { // Queen
                    score += pTeam * QUEEN_SCORE;
                    if (x > 1 && x < 6 && y > 1 && y < 6) {
                        score += pTeam * CENTRAL_BONUS;
                    }
                    if (pTeam === ourTeam) {
                        score += pTeam * OUR_TEAM_BONUS;
                    }
                }
            }
        }
    }
    score += PAWN_COUNT_SCORE[nWhitePawns];
    score -= PAWN_COUNT_SCORE[nBlackPawns];
    estimationCount += 1;
    return score + (Math.random() * 2 - 1) * randomFactor;
}

function minimax(board, depth, alpha, beta) {
    if (depth === 0 || board.isTerminal()) {
        return { value: estimateScore(board), move: null };
    }

    var bestValue,
        bestMove = null,
        possibleMoves;

    if (board.whoMoves === Team.WHITE) {
        // White moves, maximize value
        bestValue = -Infinity;

        // Generate all possible moves
        possibleMoves = board.generate();
        
        // No possible moves, draw.
        if (possibleMoves.length === 0) {
            //console.log("no moves for white");
            return { value: board.whoMoves * DRAW_SCORE, move: null };
        }
        possibleMoves.every(function (move) {
            var val = minimax(board.afterMove(move), depth - 1, alpha, beta).value;
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
            if (beta <= alpha) {
                return false; // Break 'every' loop
            }

            return true;
        });
    } else {
        // Black moves, minimize value
        bestValue = Infinity;

        // Generate all possible moves
        possibleMoves = board.generate();
        
        // No possible moves, draw.
        if (possibleMoves.length === 0) {
            //console.log("no moves for black");
            return { value: board.whoMoves * DRAW_SCORE, move: null };
        }
        possibleMoves.every(function (move) {
            var val = minimax(board.afterMove(move), depth - 1, alpha, beta).value;
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
            if (beta <= alpha) {
                return false; // Break 'every' loop
            }

            return true;
        });
    }

    //console.log("a minimax chosen step successful");
    return { value: bestValue, move: bestMove};
}

function chooseMove(board) {
    return minimax(board, minimaxDepth, -Infinity, Infinity);
}

function onMove(state) {
    //console.log("Generating a move... -- child with depth " + minimaxDepth);
    estimationCount = 0;
    var board = new Board(state),
        result;
    lastMove = state.lastMove;
    ourTeam = state.who_moves;
    randomFactor = state.randomFactor;
    result = chooseMove(board);
    result.bot = minimaxDepth;
    process.send(result);
}

//////////////////////////////////////////////////
// Main (para quando é executado diretamente)
//////////////////////////////////////////////////

function main() {
    if (process.argv[2]) {
        minimaxDepth = parseInt(process.argv[2], 10);
    }
    process.on('message', onMove);
}

if (require.main === module) {
    main();
}
}());