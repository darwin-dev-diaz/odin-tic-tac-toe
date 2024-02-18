const GameBoard = (function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const displayBoard = () => {
    for (let i = 0; i < 3; i++) {
      console.log(...board[i]);
    }
  };
  return {
    displayBoard,
  };
})();

console.log(GameBoard.displayBoard());
