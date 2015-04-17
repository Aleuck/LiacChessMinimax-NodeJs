(function () {
	var board = [[],[],[],[],[],[],[],[]];

	// color also means pawn direction in x.
	var Color = {
		WHITE : 1,
		BLACK : -1
	}

	/* -- PAWN -- */
	function Pawn(board, color, x, y) {
		this.board = board;
		this.color = color;
		this.x = x;
		this.y = y;
		board[x][y] = this;
	}
	Pawn.prototype.symbol = "P";
	Pawn.prototype.legalMoves = function () {
		var legalMoves = [];
		if (!this.board[this.x+this.color][this.y]) {
			legalMoves.push([this.x + this.color, this.y]);
		}
		if (this.board[this.x+this.color][this.y - 1]) {
			if (this.board[this.x+this.color][this.y - 1].color !== this.color)
				legalMoves.push([this.x + this.color, this.y - 1]);
		}
		if (this.board[this.x+this.color][this.y + 1]) {
			if (this.board[this.x+this.color][this.y + 1].color !== this.color)
				legalMoves.push([this.x + this.color, this.y - 1]);
		}
		return legalMoves;
	};

	/* -- QUEEN -- */
	function Queen(board, color, x, y) {
		this.board = board;
		this.color = color;
		this.x = x;
		this.y = y;
		board[x][y] = this;
	}
	Queen.prototype.symbol = "Q";
	Queen.prototype.legalMoves = function () {
		var legalMoves = [];
		var i, j;
		// forward
		i = this.x + 1;
		j = this.y;
		while (!board[i][j] && i < 8) {
			legalMoves.push([i,j]);
			i += 1;
		}
		// backward
		i = this.x -1;
		j = this.y;
		while (!board[i][j] && i > 0) {
			legalMoves.push([i,j]);
			i -= 1;
		}
		// to right
		i = this.x;
		j = this.y + 1;
		while (!board[i][j] && j < 8) {
			legalMoves.push([i,j]);
			j += 1;
		}
		// to left
		i = this.x;
		j = this.y - 1;
		while (!board[i][j] && j > 0) {
			legalMoves.push([i,j]);
			j -= 1;
		}
		// right up
		i = this.x + 1;
		j = this.y + 1;
		while (!board[i][j] && i < 8 && j < 8) {
			legalMoves.push([i,j]);
			i += 1;
			j += 1;
		}
		// right down
		i = this.x - 1;
		j = this.y + 1;
		while (!board[i][j] && i > 0 && j < 8) {
			legalMoves.push([i,j]);
			i -= 1;
			j += 1;
		}
		// left down
		i = this.x - 1;
		j = this.y - 1;
		while (!board[i][j] && i > 0 && j > 0) {
			legalMoves.push([i,j]);
			i -= 1;
			j -= 1;
		}
		// left up
		i = this.x + 1;
		j = this.y - 1;
		while (!board[i][j] && i < 8 && j > 0) {
			legalMoves.push([i,j]);
			i += 1;
			j -= 1;
		}
		return legalMoves;
	}

	/* -- HORSE -- */
	function Horse(board, color, x, y) {
		this.board = board;
		this.color = color;
		this.x = x;
		this.y = y;
		board[x][y] = this;
	}
	Horse.prototype.symbol = "H";
	Horse.prototype.legalMoves = function () {
		var legalMoves = [];

		return legalMoves;
	}
}());