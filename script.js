const gameBoardDOM = document.querySelector(".GameBoardDOM");
const cellsDOM = document.querySelectorAll(".cell");
const displayScreen = document.querySelector("h2");

function returnXSVG() {
  const xSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  xSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  xSVG.setAttribute("viewBox", "0 0 24 24");
  xSVG.classList.add("marker-svg", "x-svg");
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = "alpha-x-circle";
  xSVG.appendChild(title);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"
  );
  xSVG.appendChild(path);

  return xSVG;
}
function returnOSVG() {
  const oSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  oSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  oSVG.setAttribute("viewBox", "0 0 24 24");
  oSVG.classList.add("marker-svg", "o-svg");
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = "alpha-o-circle";
  oSVG.appendChild(title);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2Z"
  );
  oSVG.appendChild(path);

  return oSVG;
}

const GameBoard = (function () {
  let board = [];

  //working with DOM
  const resetBoard = () => {
    board = [];
    for (let rows = 0; rows < 3; rows++) {
      let row = [];
      for (let cols = 0; cols < 3; cols++) {
        row.push(createCell());
      }
      board.push(row);
    }

    cellsDOM.forEach((cell) => (cell.innerHTML = ""));
  };
  resetBoard();

  const returnBoard = () => {
    let str = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        str = str.concat(board[i][j].getMarker());
      }
      str = str.concat("\n");
    }
    return str;
  };

  //WORKING WITH DOM
  const updateBoard = (row, col, newMarker, domCELL) => {
    if (board[row][col].getMarker() === "#") {
      board[row][col].updateMarker(newMarker);
      domCELL.appendChild(newMarker === "X" ? returnXSVG() : returnOSVG());
      return true;
    }
    return false;
  };

  const checkWinner = (marker) => {
    const str = board
      .flatMap((innerArr) => innerArr.map((cell) => cell.getMarker()))
      .join("");
    const horizontalWin = new RegExp(
      `^${marker}{3}......|...${marker}{3}...|......${marker}{3}$`,
      "g"
    );
    const verticalWin = new RegExp(`(${marker}..${marker}..${marker})`, "g");
    const diagonalWin = new RegExp(
      `^${marker}...${marker}...${marker}|..${marker}.${marker}.${marker}..$`,
      "g"
    );

    for (let i = 0; i < 3; i++) {
      if (str.match([horizontalWin, verticalWin, diagonalWin][i])) {
        return true;
      }
    }
    return false;
  };

  const returnWinnerCoords = (marker) => {
    const str = board
      .flatMap((innerArr) => innerArr.map((cell) => cell.getMarker()))
      .join("");
      let returnArr = [];
    const h1 = {
      regex: `^${marker}{3}......$`,
      coords: [0, 1, 2],
    };
    const h2 = {
      regex: `^...${marker}{3}...$`,
      coords: [3, 4, 5],
    };
    const h3 = {
      regex: `^......${marker}{3}$`,
      coords: [6, 7, 8],
    };
    const v1 = {
      regex: `^${marker}..${marker}..${marker}..$`,
      coords: [0, 3, 6],
    };
    const v2 = {
      regex: `^.${marker}..${marker}..${marker}.$`,
      coords: [1, 4, 7],
    };
    const v3 = {
      regex: `^..${marker}..${marker}..${marker}$`,
      coords: [2, 5, 8],
    };
    const d1 = {
      regex: `^${marker}...${marker}...${marker}$`,
      coords: [0, 4, 8],
    };
    const d2 = {
      regex: `^..${marker}.${marker}.${marker}..$`,
      coords: [2, 4, 6],
    };

    [h1, h2, h3, v1, v2, v3, d1, d2].forEach((winObj) => {
      if (str.match(new RegExp(winObj.regex), "g")) {
        returnArr = winObj.coords;
      }
    });
    return returnArr;
  };

  const checkTie = () => {
    const str = board
      .flatMap((innerArr) => innerArr.map((cell) => cell.getMarker()))
      .join("");
    if (!str.includes("#")) {
      console.log("It's a tie");
      return true;
    }
    return false;
  };

  return {
    resetBoard,
    returnBoard,
    updateBoard,
    checkWinner,
    returnWinnerCoords,
    checkTie,
  };
})();

function createCell() {
  let marker = "#";
  const updateMarker = (newMarker) => {
    marker = newMarker;
  };
  const getMarker = () => {
    return marker;
  };

  return { getMarker, updateMarker };
}

const GameController = (function () {
  const players = [
    { name: "X", marker: "X" },
    { name: "O", marker: "O" },
  ];
  let currentPlayer = players[0];

  const switchCurrentPlayer = (reset = false) => {
    if (reset) {
      currentPlayer = players[0];
    } else {
      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const printNewRound = () => {};

  const playRound = (row, col, domCELL) => {
    if (GameBoard.updateBoard(row, col, currentPlayer.marker, domCELL)) {
    } else {
      alert("Enter a valid position!");
    }
    printNewRound();
  };

  return {
    playRound,
    getCurrentPlayer,
    switchCurrentPlayer,
  };
})();

cellsDOM.forEach((cell, i) => {
  cell.addEventListener("click", () => {
    let message = "";
    const row = Math.floor(i / 3);
    const col = i % 3;

    GameController.playRound(row, col, cell);
    if (GameBoard.checkWinner(GameController.getCurrentPlayer().marker)) {
      message = `${GameController.getCurrentPlayer().name} wins!`;
      const winIndices = GameBoard.returnWinnerCoords(GameController.getCurrentPlayer().marker);
      winIndices.forEach(index=>cellsDOM[index].children[0].style.fill = 'var(--mon-yellow)');
      // GameBoard.resetBoard();
      GameController.switchCurrentPlayer(true);
    } else if (GameBoard.checkTie()) {
      GameBoard.resetBoard();
      GameController.switchCurrentPlayer(true);
      message = `TIE! ${GameController.getCurrentPlayer().name}'s turn`;
    } else {
      GameController.switchCurrentPlayer();
      message = `${GameController.getCurrentPlayer().name}'s turn`;
    }

    displayScreen.textContent = message;
  });
});
