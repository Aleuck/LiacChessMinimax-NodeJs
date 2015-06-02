(function (exports) {
    'use strict';
    function coordToIdx(coord) {
    }
    function IdxToCoord(idx) {
    }
    function Board(state) {
        this.whoMoves = state.who_moves;
        this.enpassant = state.enpassant ? { x: state.enpassant[1], y: state.enpassant[0] } : false;
    }
    Board.prototype = {
        generate: function () {},
        afterMove: function (move) {},
        isTerminal : function () {},
        print: function () {
    }
    exports.Board = Board;
}(exports));