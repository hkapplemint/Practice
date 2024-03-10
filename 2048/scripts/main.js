const ALL_BACKGROUND_CELL_DIVS = document.querySelectorAll(".background-cell");
const scoreDiv = document.querySelector(".score");

const CELL_BG_COLORS = [
  "#eee4da",
  "#ede0c8",
  "#f2b179",
  "#f59563",
  "#f67c60",
  "#f65e3b",
  "#edcf73",
  "#edcc62",
  "#edc850",
  "#edc53f",
  "#edc22d",
];
const CELL_FONT_COLORS = ["#776e65", "#776e65", "#f9f6f2"];
const CELL_FONT_SIZES = ["min(10vw, 10vh)", "min(9vw, 9vh)", "min(8vw, 8vh)"];

let score = 0;

const styleCell = (cell) => {
  const number = parseInt(cell.textContent);
  let relativeBgColorIndex = Math.log2(number) - 1;
  if (relativeBgColorIndex > CELL_BG_COLORS.length - 1) {
    relativeBgColorIndex = CELL_BG_COLORS.length - 1;
  }
  let relativeFontColorIndex = Math.log2(number) - 1;
  if (relativeFontColorIndex > CELL_FONT_COLORS.length - 1) {
    relativeFontColorIndex = CELL_FONT_COLORS.length - 1;
  }
  let relativeFontSize = Math.log2(number);
  if (relativeFontSize < 7) {
    cell.style.fontSize = CELL_FONT_SIZES[0];
  } else if (relativeFontSize >= 7 && relativeFontSize <= 9) {
    cell.style.fontSize = CELL_FONT_SIZES[1];
  } else {
    cell.style.fontSize = CELL_FONT_SIZES[2];
  }
  cell.style.backgroundColor = CELL_BG_COLORS[relativeBgColorIndex];
  cell.style.color = CELL_FONT_COLORS[relativeFontColorIndex];
};

const generateRandomCell = () => {
  //get all empty cells
  //randomly choose one of the empty cell
  //create a new element and append to that empty cell
  const backgroundCells = document.querySelectorAll(".background-cell");

  const emptyCellsDivArr = [...backgroundCells].filter(
    (backgroundCell) => backgroundCell.dataset.isEmpty === "true"
  );

  //guard clause: if there is no empty cell in the game, game over
  if (emptyCellsDivArr.length === 0) {
    gameOver();
    return;
  }

  const randomCellDiv =
    emptyCellsDivArr[Math.floor(Math.random() * emptyCellsDivArr.length)];

  const newElement = document.createElement("div");
  newElement.classList.add("cell");
  //70% to be a 2, 30% to be a 4
  newElement.textContent = Math.random() > 0.3 ? 2 : 4;
  styleCell(newElement);
  newElement.dataset.col = randomCellDiv.dataset.col;
  newElement.dataset.row = randomCellDiv.dataset.row;
  newElement.dataset.merged = "false";
  //move the newly created cell to the specified place by using translate
  newElement.style.translate = `calc((100% + var(--gap-width))*${newElement.dataset.col}) calc((100% + var(--gap-width))*${newElement.dataset.row})`;

  const gameOverlayDiv = document.getElementById("game-overlay");
  gameOverlayDiv.append(newElement);

  //mark this chosen cell to be NOT empty
  randomCellDiv.dataset.isEmpty = "false";

  setTimeout(() => {
    newElement.style.scale = "1";
  }, 100);

  return true;
};

let globalMergeCount = 0;

function move(direction) {
  const allCellsArr = document.querySelectorAll(".cell");
  let movementCounter = 0;
  let allPossibleMoveCellArr;
  switch (direction) {
    case "left":
      allPossibleMoveCellArr = [...allCellsArr]
        .filter((cell) => cell.dataset.col !== "0")
        .sort((a, b) => a.dataset.col - b.dataset.col);
      break;
    case "down":
      allPossibleMoveCellArr = [...allCellsArr]
        .filter((cell) => cell.dataset.row !== "3")
        .sort((a, b) => b.dataset.row - a.dataset.row);
      break;
    case "up":
      allPossibleMoveCellArr = [...allCellsArr]
        .filter((cell) => cell.dataset.row !== "0")
        .sort((a, b) => a.dataset.row - b.dataset.row);
      break;
    case "right":
      allPossibleMoveCellArr = [...allCellsArr]
        .filter((cell) => cell.dataset.col !== "3")
        .sort((a, b) => b.dataset.col - a.dataset.col);
      break;
  }

  allPossibleMoveCellArr.forEach((cell) => {
    let col = cell.dataset.col;
    let row = cell.dataset.row;

    let respectiveBgCell = findBgDiv(col, row);

    while (directionIsEmptyOrEqual(col, row, direction)) {
      movementCounter++;

      respectiveBgCell = findBgDiv(col, row);
      respectiveBgCell.dataset.isEmpty = "true";

      switch (direction) {
        case "left":
          cell.dataset.col = parseInt(cell.dataset.col) - 1;
          break;
        case "down":
          cell.dataset.row = parseInt(cell.dataset.row) + 1;
          break;
        case "up":
          cell.dataset.row = parseInt(cell.dataset.row) - 1;
          break;
        case "right":
          cell.dataset.col = parseInt(cell.dataset.col) + 1;
          break;
      }
      col = cell.dataset.col;
      row = cell.dataset.row;

      respectiveBgCell = findBgDiv(col, row);
      if (respectiveBgCell) {
        respectiveBgCell.dataset.isEmpty = "false";
      }

      if (globalMergeCount > 0) break;
    }
    updateCellPosition(cell, cell.dataset.col, cell.dataset.row);
  });
  return movementCounter !== 0;
}

function directionIsEmptyOrEqual(col, row, direction) {
  let targetBgCell, targetNumberCell;
  const ogNumberCell = findNumberCell(col, row);
  switch (direction) {
    case "left":
      targetBgCell = findBgDiv(parseInt(col) - 1, row);
      targetNumberCell = findNumberCell(parseInt(col) - 1, row);
      break;
    case "down":
      targetBgCell = findBgDiv(col, parseInt(row) + 1);
      targetNumberCell = findNumberCell(col, parseInt(row) + 1);
      break;
    case "right":
      targetBgCell = findBgDiv(parseInt(col) + 1, row);
      targetNumberCell = findNumberCell(parseInt(col) + 1, row);
      break;
    case "up":
      targetBgCell = findBgDiv(col, parseInt(row) - 1);
      targetNumberCell = findNumberCell(col, parseInt(row) - 1);
      break;
  }

  if (targetBgCell) {
    if (targetBgCell.dataset.isEmpty === "true") {
      globalMergeCount = 0;
      return true;
    } else if (
      targetNumberCell &&
      targetNumberCell.textContent == ogNumberCell.textContent &&
      targetNumberCell.dataset.merged !== "true"
    ) {
      globalMergeCount++;
      merge(targetNumberCell, ogNumberCell);
      return true;
    } else {
      globalMergeCount = 0;
      return false;
    }
  }
}

//----------------------------------------------------------------------//
//---------------------------- Minor functions -------------------------//
//----------------------------------------------------------------------//
let gameWon = false;

function merge(targetNumberCell, ogNumberCell) {
  targetNumberCell.style.zIndex = "3";
  ogNumberCell.style.zIndex = "0";
  targetNumberCell.textContent = parseInt(ogNumberCell.textContent) * 2;
  styleCell(targetNumberCell);

  if (targetNumberCell.textContent === "2048" && !gameWon) {
    gameWin();
  }

  targetNumberCell.dataset.merged = "true";
  ogNumberCell.dataset.merged = "true";

  scoreDiv.textContent =
    parseInt(scoreDiv.textContent) + parseInt(targetNumberCell.textContent);
  score = parseInt(scoreDiv.textContent);

  setTimeout(() => {
    ogNumberCell.remove();
  }, 100);
}
function updateCellPosition(cell, col, row) {
  cell.style.translate = `calc((100% + var(--gap-width))*${col}) calc((100% + var(--gap-width))*${row})`;
  cell.style.zIndex = "0";
}
function resetAllCellStatusAfterMove() {
  const cellsArr = document.querySelectorAll(".cell");
  [...cellsArr].forEach((cell) => (cell.dataset.merged = "false"));
}
function findBgDiv(col, row) {
  return [...ALL_BACKGROUND_CELL_DIVS].find(
    (bgCell) => bgCell.dataset.col == col && bgCell.dataset.row == row
  );
}
function findNumberCell(col, row) {
  return [...document.querySelectorAll(".cell")].find(
    (cell) => cell.dataset.col == col && cell.dataset.row == row
  );
}
function gameWin() {
  gameWon = true;

  const gameWinDialog = document.getElementById("game-win-dialog");

  document.removeEventListener("keydown", handleKeydown);

  setTimeout(() => {
    gameWinDialog.style.display = "grid";
    gameWinDialog.showModal();
  }, 200);

  const gameWinContinue = document.getElementById("game-win-continue");
  gameWinContinue.addEventListener("click", () => {
    gameWinDialog.style.display = "none";
    gameWinDialog.close();

    document.addEventListener("keydown", handleKeydown);
  });

  const gameWinRestart = document.getElementById("game-win-restart");
  gameWinRestart.addEventListener("click", () => {
    gameWinDialog.style.display = "none";
    gameWinDialog.close();

    restart();

    document.addEventListener("keydown", handleKeydown);
  });
}

function gameOver() {
  document.removeEventListener("keydown", handleKeydown);

  const gameOverDialog = document.getElementById("game-over-dialog");

  setTimeout(() => {
    gameOverDialog.style.display = "grid";
    gameOverDialog.showModal();
  }, 200);

  const gameOverRestart = document.getElementById("game-over-restart");
  gameOverRestart.addEventListener("click", () => {
    document.addEventListener("keydown", handleKeydown);

    gameOverDialog.style.display = "none";
    gameOverDialog.close();

    restart();
  });

  const gameOverUndo = document.getElementById("game-over-undo");
  gameOverUndo.addEventListener("click", () => {
    document.addEventListener("keydown", handleKeydown);
    gameOverDialog.style.display = "none";
    gameOverDialog.close();

    loadPreviousGameState();
  });
}
//______________________________________________________________________//
//_______________________ End of minor functions _______________________//
//______________________________________________________________________//

//----------------------------------------------------------------------//
//----------------------- For undo functionality -----------------------//
//----------------------------------------------------------------------//
const gameCellStateArr = [];

const backgroundContainer = document.querySelector(".background-container");
function createCustomCell(col, row, number) {
  const newCell = document.createElement("div");
  newCell.dataset.col = col;
  newCell.dataset.row = row;
  newCell.dataset.merged = "false";
  newCell.textContent = number;
  newCell.classList.add("cell");

  const relativeBgCell = findBgDiv(col, row);
  relativeBgCell.dataset.isEmpty = "false";

  const gameOverlayDiv = document.querySelector(".game-overlay");
  gameOverlayDiv.append(newCell);

  setTimeout(() => {
    newCell.style.scale = "1";
  }, 100);

  styleCell(newCell);
  updateCellPosition(newCell, col, row);
}
function setAllBGCellEmpty() {
  const backgroundCells = document.querySelectorAll(".background-cell");
  [...backgroundCells].forEach(
    (backgroundCell) => (backgroundCell.dataset.isEmpty = "true")
  );
}
function removeAllGameCell() {
  const gameOverlay = document.getElementById("game-overlay");
  while (gameOverlay.children.length > 0) {
    gameOverlay.firstElementChild.remove();
  }
}

function saveGameState() {
  setTimeout(() => {
    const gameCells = document.querySelectorAll(".cell");

    const currentGameCellStateArr = [];
    [...gameCells].forEach((gameCell) => {
      currentGameCellStateArr.push({
        col: gameCell.dataset.col,
        row: gameCell.dataset.row,
        num: gameCell.textContent,
        score: score,
      });
    });
    gameCellStateArr.push(currentGameCellStateArr);
  }, 110);
}
function loadPreviousGameState() {
  //guard clause for user pressing restart at the start of the game
  if (gameCellStateArr.length < 2) return;

  setAllBGCellEmpty();
  removeAllGameCell();

  const previousGameCellStateArr =
    gameCellStateArr[gameCellStateArr.length - 2];
  const removedGameCellStateArr = gameCellStateArr.pop();
  previousGameCellStateArr.forEach((gameCell) => {
    createCustomCell(gameCell.col, gameCell.row, gameCell.num);
  });

  const scoreDiv = document.querySelector(".score");
  scoreDiv.textContent = previousGameCellStateArr[0].score;
}

const undoContainer = document.querySelector(".undo-container");
undoContainer.addEventListener("click", loadPreviousGameState);

//______________________________________________________________________//
//_______________________ End of undo functionality ____________________//
//______________________________________________________________________//

function afterMoveLogic() {
  isKeydown = true;
  globalMergeCount = 0;
  resetAllCellStatusAfterMove();
  generateRandomCell();
  saveGameState();
}

let isThrottled = false;
let isKeydown = false;

function handleKeydown(e) {
  e.preventDefault();

  if (isKeydown) return;

  switch (e.key) {
    case "ArrowLeft":
      if (move("left")) {
        afterMoveLogic();
      }
      break;
    case "ArrowRight":
      if (move("right")) {
        afterMoveLogic();
      }
      break;
    case "ArrowUp":
      if (move("up")) {
        afterMoveLogic();
      }
      break;
    case "ArrowDown":
      if (move("down")) {
        afterMoveLogic();
      }
      break;
  }
}

document.addEventListener("keydown", handleKeydown);

document.addEventListener("keyup", () => {
  isKeydown = false;
});

//----------------------------------------------------------------------//
//---------------------- For touch functionality -----------------------//
//----------------------------------------------------------------------//
let initialX, initialY;
document.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  initialX = touch.clientX;
  initialY = touch.clientY;
});
document.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();

    const touch = e.changedTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    const sensitivity = 20;
    const allowance = 20;

    const swipeLeft =
      currentX - initialX < -sensitivity &&
      Math.abs(currentY - initialY) < allowance;
    const swipeDown =
      currentY - initialY > sensitivity &&
      Math.abs(currentX - initialX) < allowance;
    const swipeUp =
      currentY - initialY < -sensitivity &&
      Math.abs(currentX - initialX) < allowance;
    const swipeRight =
      currentX - initialX > sensitivity &&
      Math.abs(currentY - initialY) < allowance;

    const leftArrowEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    const downArrowEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
    const upArrowEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
    const rightArrowEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });

    if (isKeydown) return;

    if (swipeLeft) {
      document.dispatchEvent(leftArrowEvent);
      isKeydown = true;
    } else if (swipeDown) {
      document.dispatchEvent(downArrowEvent);
      isKeydown = true;
    } else if (swipeUp) {
      document.dispatchEvent(upArrowEvent);
      isKeydown = true;
    } else if (swipeRight) {
      document.dispatchEvent(rightArrowEvent);
      isKeydown = true;
    }
  },
  { passive: false }
);

document.addEventListener("touchend", () => {
  isKeydown = false;
});
document.addEventListener("touchcancel", () => {
  isKeydown = false;
});

const restartContainer = document.querySelector(".restart-container");
const restartDialog = document.querySelector(".restart-dialog");
restartContainer.addEventListener("click", () => {
  restartDialog.style.display = "grid";
  restartDialog.showModal();

  //remove keydown listener to prevent user keep playing even if the restart modal appeared
  document.removeEventListener("keydown", handleKeydown);
});

const restartYesBtn = document.getElementById("restart-yes");
restartYesBtn.addEventListener("click", (e) => {
  //hide the restart modal
  restartDialog.close();
  restartDialog.style.display = "none";
  //perform restart setup
  restart();

  document.addEventListener("keydown", handleKeydown);
});

function restart() {
  removeAllGameCell();
  setAllBGCellEmpty();
  generateRandomCell();
  scoreDiv.textContent = "0";
  gameWon = false;
}

const restartNoBtn = document.getElementById("restart-no");
restartNoBtn.addEventListener("click", () => {
  //hide the restart modal
  restartDialog.style.display = "none";
  restartDialog.close();

  document.addEventListener("keydown", handleKeydown);
});

generateRandomCell();
