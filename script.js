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

  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        _board[i][j] = undefined;
      }
    }
  };

  const checkGameOver = () => {
    let gameIsOver = false;
    let winner;

    // if diagonal is empty - no winner yet
    if (
      _board[0][0] === _board[1][1] &&
      _board[0][0] === _board[2][2] &&
      _board[0][0] === undefined
    ) {
      return { gameIsOver, winner };
    }

    // check for a row-win
    for (let row = 0; row < 3 && !gameIsOver; row++) {
      if (
        _board[row][0] === _board[row][1] &&
        _board[row][0] === _board[row][2] &&
        _board[row][0] !== undefined
      ) {
        gameIsOver = true;
        winner = _board[row][0];
      }
    }

    // check for col-win
    if (!gameIsOver) {
      for (let col = 0; col < 3 && !gameIsOver; col++) {
        if (
          _board[0][col] === _board[1][col] &&
          _board[0][col] === _board[2][col] &&
          _board[0][col] !== undefined
        ) {
          gameIsOver = true;
          winner = _board[0][col];
        }
      }
    }

    // check for diag-win
    if (!gameIsOver) {
      if (_board[0][0] === _board[1][1] && _board[0][0] === _board[2][2]) {
        gameIsOver = true;
        winner = _board[0][0];
      }
      if (_board[2][0] === _board[1][1] && _board[2][0] === _board[0][2]) {
        gameIsOver = true;
        winner = _board[2][0];
      }
    }

    // check for tied game
    if (!gameIsOver) {
      let freeSpaceCounter = 0;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (_board[i][j] === undefined) {
            freeSpaceCounter++;
          }
        }
      }
      if (freeSpaceCounter === 0) {
        return { gameIsOver: true, winner };
      }
    }

    return { gameIsOver, winner };
  };

  const getPositionValue = (i, j) => _board[i][j];

  return {
    getBoardRepresentation,
    playOnSpot,
    getPositionValue,
    checkGameOver,
    resetBoard,
  };
})();

const displayController = (() => {
  let _currentPlayerIndex = 0;
  let _players = [];
  let _board;

  const setPlayers = (player1, player2) => {
    _players = [player1, player2];
  };

  const printPlayers = () => {
    for (const player of _players) {
      console.log(`Name: ${player.name}`);
    }
  };

  const displayWinner = (winner) => {
    let winnerText;

    if (winner === undefined) {
      winnerText = "The game is tied";
    } else {
      winnerText = `The winner is ${_players[winner].name}!`;
    }

    const overlayElement = document.getElementById("overlay");
    const overlayText = document.getElementById("overlay-text");

    overlayText.textContent = winnerText;
    overlayElement.style.display = "flex";
  };

  const nextPlayerPlaysOnBoard = (i, j) => {
    if (_board.playOnSpot(i, j, _currentPlayerIndex)) {
      _currentPlayerIndex = 1 - _currentPlayerIndex; // switch active player

      const gameState = _board.checkGameOver();

      if (gameState.gameIsOver) {
        displayWinner(gameState.winner);
      }
    }
  };

  const displayHtmlBoard = () => {
    const oldGameContainer = document.getElementById("gamecontainer");

    const gameContainer = document.createElement("div");
    gameContainer.setAttribute("id", "gamecontainer");
    gameContainer.setAttribute("class", "gamecontainer");

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const gameSquare = document.createElement("div");
        gameSquare.setAttribute("row", i);
        gameSquare.setAttribute("col", j);
        gameSquare.setAttribute("class", "gamesquare empty");
        if (_board.getPositionValue(i, j) === undefined) {
          gameSquare.setAttribute("class", "gamesquare empty");
        } else if (_board.getPositionValue(i, j)) {
          gameSquare.setAttribute("class", "gamesquare");
          gameSquare.innerText = "X";
        } else {
          gameSquare.setAttribute("class", "gamesquare");
          gameSquare.innerText = "O";
        }

        gameSquare.addEventListener("click", (event) => {
          const tgt = event.target;
          nextPlayerPlaysOnBoard(
            tgt.getAttribute("row"),
            tgt.getAttribute("col")
          );
          displayHtmlBoard();
        });

        gameContainer.appendChild(gameSquare);
      }
    }

    oldGameContainer.replaceWith(gameContainer);
  };

  const restartGame = () => {
    _board.resetBoard();
    document.getElementById("overlay").style.display = "none";

    _players.forEach((player) => {
      player.resetScore();
    });

    displayHtmlBoard();
  };

  const continueGame = () => {
    _board.resetBoard();
    document.getElementById("overlay").style.display = "none";

    displayHtmlBoard();
  };

  const initialiseOverlayButtons = () => {
    const buttonContinue = document.getElementById("btn-continue");
    const buttonRestartGame = document.getElementById("btn-restart");

    buttonRestartGame.addEventListener("click", restartGame);
    buttonContinue.addEventListener("click", continueGame);
  };

  const setBoard = (board) => {
    _board = board;
    initialiseOverlayButtons();
    displayHtmlBoard();
  };

  const checkBoard = () => _board.checkGameOver();

  return {
    setPlayers,
    setBoard,
    printPlayers,
    nextPlayerPlaysOnBoard,
    checkBoard,
  };
})();

const Player = (name) => {
  const playerSymbol = undefined;
  let score = 0;

  const registerWin = () => {
    score++;
  };

  const resetScore = () => {
    score = 0;
  };

  return { name, playerSymbol, registerWin, resetScore };
};

const player1 = Player("Jonas", 0);
const player2 = Player("Jonasson", 1);

displayController.setPlayers(player1, player2);
displayController.setBoard(gameBoard);
