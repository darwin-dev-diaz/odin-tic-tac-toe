const GameBoard = (function () {
  let board = [];

  const resetBoard = () => {
    board = [];
    for (let rows = 0; rows < 3; rows++) {
      let row = [];
      for (let cols = 0; cols < 3; cols++) {
        row.push(createCell());
      }
      board.push(row);
    }
  };
  resetBoard();

  const returnBoard = () => {
    let str = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        str = str.concat(board[i][j].marker);
      }
      str = str.concat("\n");
    }
    return str;
  };

  const updateBoard = (row, col, newMarker) => {
    if (board[row][col].marker === "#") {
      board[row][col].marker = newMarker;
      return true;
    }
    return false;
  };

  const checkWinner = (marker) => {
    const str = board
      .flatMap((innerArr) => innerArr.map((cell) => cell.marker))
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

    for(let i = 0; i < 3; i ++){
      if (str.match([horizontalWin, verticalWin, diagonalWin][i])) {
        return true;
      }
    }
    return false;
    // [horizontalWin, verticalWin, diagonalWin].forEach((regex) => {
    //   console.log(str.match(regex));
    //   if (str.match(regex)) {
    //     break;
    //     return true;
    //   }
    //   return false;
    // });
  };

  return {
    resetBoard,
    returnBoard,
    updateBoard,
    checkWinner,
  };
})();

function createCell() {
  let marker = "#";
  const updateMarker = (newMarker) => {
    marker = newMarker;
  };

  return { marker, updateMarker };
}

// console.log(GameBoard.returnBoard());
GameBoard.updateBoard(0, 2, 7);
GameBoard.updateBoard(1, 1, 7);
GameBoard.updateBoard(2, 0, 7);
console.log(GameBoard.returnBoard());
console.log(GameBoard.checkWinner('7'));
