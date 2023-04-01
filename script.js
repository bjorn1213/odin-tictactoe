const gameBoard = (() => {
  const _board = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  const getPrintableBoardItem = (i, j) => {
    const boardItem = _board[i][j];
    let returnVal = "";

    if (boardItem === undefined) {
      returnVal = "_";
    } else if (boardItem) {
      returnVal = "X";
    } else {
      returnVal = "O";
    }

    return returnVal;
  };

  const getBoardRepresentation = () => {
    let currentLine = "";

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        currentLine += `${getPrintableBoardItem(i, j)} `;
      }
      currentLine += "\n";
    }

    return currentLine;
  };

  const playOnSpot = (i, j, value) => {
    if (_board[i][j] !== undefined || i > 3 || j > 3) {
      return false;
    }
    _board[i][j] = value;
    return true;
  };

  return { getBoardRepresentation, playOnSpot };
})();

const displayController = (() => {
  let _currentPlayerIndex = 0;

  const setPlayers = (player1, player2) => {
    this.players = [player1, player2];
  };

  const setBoard = (board) => {
    this.board = board;
  };

  const printPlayers = () => {
    for (const player of this.players) {
      console.log(`Name: ${player.name}`);
    }
  };

  const nextPlayerPlaysOnBoard = (i, j) => {
    if (this.board.playOnSpot(i, j, _currentPlayerIndex)) {
      _currentPlayerIndex = 1 - _currentPlayerIndex; // switch active player
    }

    console.log(this.board.getBoardRepresentation());
  };

  return { setPlayers, setBoard, printPlayers, nextPlayerPlaysOnBoard };
})();

const Player = (name) => {
  const playerSymbol = undefined;

  return { name, playerSymbol };
};

const player1 = Player("Jonas", 0);
const player2 = Player("Jonasson", 1);

displayController.setPlayers(player1, player2);
displayController.setBoard(gameBoard);

displayController.nextPlayerPlaysOnBoard(0, 0);
