var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = {
  topStrike: [0, 1, 2],
  midrowStrike: [3, 4, 5],
  bottomStrike: [6, 7, 8],
  leftStrike: [0, 3, 6],
  midcolStrike: [1, 4, 7],
  rightStrike: [2, 5, 8],
  diagLStrike: [0, 4, 8],
  diagRStrike: [6, 4, 2],
};

const cells = document.querySelectorAll(".cell");
startGame();

function displayNone(element) {
  element.style.display = "none";
}

function startGame() {
  const lines = document.querySelectorAll(".endgame");
  document.querySelector(".text").style.display = "none";
  lines.forEach(displayNone);
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie())
      turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let win of Object.values(winCombos)) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { win: win, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You won !!!" : "You lost :(");

  let strikeKey = Object.keys(winCombos).find(
    (key) => winCombos[key] == gameWon.win
  );
  console.log(strikeKey);
  document.querySelector(`#${strikeKey}`).style.display = "inline-block";
}

function displayLines(element) {
  element.style.display = "inline";
}

function declareWinner(who) {
  const lines = document.querySelectorAll(".endgame");
  lines.forEach(displayLines);
  document.querySelector(".text").innerText = who;
  console.log(who);
  document.querySelector(".text").style.display = "block";
}

function emptySquares() {
  return origBoard.filter((s) => typeof s == "number");
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      // modify the green color stuff
      // cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
