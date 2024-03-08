const ALL_BACKGROUND_CELL_DIVS = document.querySelectorAll(".background-cell")

const CELL_BG_COLORS = ["#eee4da", "#ede0c8", "#f2b179", "#f59563", "#f67c60", "#f65e3b", "#edcf73", "#edcc62", "#edc850", "#edc53f", "#edc22d"]
const CELL_FONT_COLORS = ["#776e65", "#776e65", "#f9f6f2"]
const CELL_FONT_SIZES = ["min(10vw, 10vh)", "min(9vw, 9vh)", "min(8vw, 8vh)"]

const styleCell = (cell) => {
    const number = parseInt(cell.textContent);
    let relativeBgColorIndex = Math.log2(number) - 1
    if (relativeBgColorIndex > CELL_BG_COLORS.length - 1) {
        relativeBgColorIndex = CELL_BG_COLORS.length - 1
    }
    let relativeFontColorIndex = Math.log2(number) - 1
    if (relativeFontColorIndex > CELL_FONT_COLORS.length - 1) {
        relativeFontColorIndex = CELL_FONT_COLORS.length - 1
    }
    let relativeFontSize = Math.log2(number)
    if (relativeFontSize < 7) {
        cell.style.fontSize = CELL_FONT_SIZES[0]
    } else if (relativeFontSize >= 7 && relativeFontSize <= 9) {
        cell.style.fontSize = CELL_FONT_SIZES[1]
    }
    else {
         cell.style.fontSize = CELL_FONT_SIZES[2]
    }
    cell.style.backgroundColor = CELL_BG_COLORS[relativeBgColorIndex]
    cell.style.color = CELL_FONT_COLORS[relativeFontColorIndex]
}

const generateRandomCell = () => {
    //get all empty cells
    //randomly choose one of the empty cell
    //create a new element and append to that empty cell
    const emptyCellsDivArr = [...ALL_BACKGROUND_CELL_DIVS].filter(backgroundCell => backgroundCell.dataset.isEmpty === "true")

    //guard clause: if there is no empty cell in the game, return
    if (emptyCellsDivArr.length === 0) return false;

    const randomCellDiv = emptyCellsDivArr[Math.floor(Math.random()*emptyCellsDivArr.length)]

    //translate: calc((100% + var(--gap-width))*3) calc((100% + var(--gap-width))*3)
    
    const newElement = document.createElement("div")
    newElement.classList.add("cell");
    //70% to be a 2, 30% to be a 4
    newElement.textContent = Math.random() > 0.3 ? 2 : 4;
    styleCell(newElement);
    newElement.dataset.col = randomCellDiv.dataset.col;
    newElement.dataset.row = randomCellDiv.dataset.row;
    //move the newly created cell to the specified place by using translate
    newElement.style.translate = `calc((100% + var(--gap-width))*${newElement.dataset.col}) calc((100% + var(--gap-width))*${newElement.dataset.row})`

    const gameOverlayDiv = document.querySelector(".game-overlay");
    gameOverlayDiv.append(newElement);

    //mark this chosen cell to be NOT empty
    randomCellDiv.dataset.isEmpty = "false";

    setTimeout(() => {
        newElement.style.scale = "1"
    }, 100)

    return true;
}

const findBgDiv = (col, row) => {
    return [...ALL_BACKGROUND_CELL_DIVS].find(bgCell => bgCell.dataset.col == col && bgCell.dataset.row == row)
}
const findNumberCell = (col, row) => {
    return [...document.querySelectorAll(".cell")].find(cell => cell.dataset.col == col && cell.dataset.row == row)
}

let globalMergeCount = 0;

const moveLeft = () => {
    const allCellsArr = document.querySelectorAll(".cell");
    const allPossibleLeftMoveCellArr = [...allCellsArr]
        .filter(cell => cell.dataset.col !== "0")
        .sort((a, b) => a.dataset.col - b.dataset.col)

    let movementCounter = 0;

    allPossibleLeftMoveCellArr.forEach(cell => {

        let col = cell.dataset.col;
        let row = cell.dataset.row;

        let respectiveBgCell = findBgDiv(col, row)
        let leftBgCell = findBgDiv(parseInt(col)-1, row)

        while (directionIsEmptyOrEqual(col, row, "left")) {
            movementCounter++
            
            respectiveBgCell = findBgDiv(col, row)
            respectiveBgCell.dataset.isEmpty = "true"
            
            cell.dataset.col = parseInt(cell.dataset.col) - 1;
            col = cell.dataset.col
            
            leftBgCell = findBgDiv(col, row)
            if(leftBgCell) {
                //because thi cell moved to the background cell which originally to the left of the cell
                //we set the leftBgCell to be NOT empty
                leftBgCell.dataset.isEmpty = "false"
            }
            
            if(globalMergeCount > 0) break
        }
        updateCellPosition(cell, cell.dataset.col, cell.dataset.row)
    })
    //if movementCounter = 0, this mean the while loop has never been ran
    //meaning no cells were moved
    //return "false" if movementCounter === 0
    return movementCounter !== 0
}

const moveDown = () => {
    const allCellsArr = document.querySelectorAll(".cell");
    const allPossibleDownMoveCellArr = [...allCellsArr]
        .filter(cell => cell.dataset.row !== "3")
        .sort((a, b) => b.dataset.row - a.dataset.row)

    let movementCounter = 0;

    allPossibleDownMoveCellArr.forEach(cell => {

        let col = cell.dataset.col;
        let row = cell.dataset.row;

        let respectiveBgCell = findBgDiv(col, row)
        let downBgCell = findBgDiv(col, parseInt(row)+1)

        while (directionIsEmptyOrEqual(col, row, "down")) {
            
            movementCounter++
            
            respectiveBgCell = findBgDiv(col, row)
            respectiveBgCell.dataset.isEmpty = "true"
            
            cell.dataset.row = parseInt(cell.dataset.row) + 1;
            row = cell.dataset.row
            
            downBgCell = findBgDiv(col, row)
            if(downBgCell) {
                downBgCell.dataset.isEmpty = "false"
            }

            if(globalMergeCount > 0) break
        }
        updateCellPosition(cell, cell.dataset.col, cell.dataset.row)
    })
    return movementCounter !== 0
}

const moveUp = () => {
    const allCellsArr = document.querySelectorAll(".cell");
    const allPossibleUpMoveCellArr = [...allCellsArr]
        .filter(cell => cell.dataset.row !== "0")
        .sort((a, b) => a.dataset.row - b.dataset.row)

    let movementCounter = 0;

    allPossibleUpMoveCellArr.forEach(cell => {

        let col = cell.dataset.col;
        let row = cell.dataset.row;

        let respectiveBgCell = findBgDiv(col, row)
        let upBgCell = findBgDiv(col, parseInt(row) - 1)

        while (directionIsEmptyOrEqual(col, row, "up")) {
            
            movementCounter++
            
            respectiveBgCell = findBgDiv(col, row)
            respectiveBgCell.dataset.isEmpty = "true"
            
            cell.dataset.row = parseInt(cell.dataset.row) -1;
            row = cell.dataset.row
            
            upBgCell = findBgDiv(col, row)
            if(upBgCell) {
                upBgCell.dataset.isEmpty = "false"
            }

            if(globalMergeCount > 0) break
        }
        updateCellPosition(cell, cell.dataset.col, cell.dataset.row)
    })
    return movementCounter !== 0
}

const moveRight = () => {
    const allCellsArr = document.querySelectorAll(".cell");
    const allPossibleRightMoveCellArr = [...allCellsArr]
        .filter(cell => cell.dataset.col !== "3")
        .sort((a, b) => b.dataset.col - a.dataset.col)

    let movementCounter = 0;

    allPossibleRightMoveCellArr.forEach(cell => {

        let col = cell.dataset.col;
        let row = cell.dataset.row;

        let respectiveBgCell = findBgDiv(col, row)
        let rightBgCell = findBgDiv(parseInt(col) + 1, row)

        while (directionIsEmptyOrEqual(col, row, "right")) {
            
            movementCounter++
            
            respectiveBgCell = findBgDiv(col, row)
            respectiveBgCell.dataset.isEmpty = "true"
            
            cell.dataset.col = parseInt(cell.dataset.col) + 1;
            col = cell.dataset.col
            
            rightBgCell = findBgDiv(col, row)
            if(rightBgCell) {
                rightBgCell.dataset.isEmpty = "false"
            }

            if(globalMergeCount > 0) break
        }
        updateCellPosition(cell, cell.dataset.col, cell.dataset.row)
    })
    return movementCounter !== 0
}

function directionIsEmptyOrEqual(col, row, direction) {
    let targetBgCell, targetNumberCell;
    const ogNumberCell = findNumberCell(col, row);
    switch (direction) {
        case "left":
            targetBgCell = findBgDiv(parseInt(col)-1, row)
            targetNumberCell = findNumberCell(parseInt(col)-1, row)

            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell && targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged !== "true") {
                    globalMergeCount++
                    merge(targetNumberCell, ogNumberCell)
                    return true
                } else {
                    globalMergeCount = 0;
                    return false
                }
            }
            break
        case "down":
            targetBgCell = findBgDiv(col, parseInt(row) + 1)
            targetNumberCell = findNumberCell(col, parseInt(row) + 1)
            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged !== "true") {
                    globalMergeCount++
                    merge(targetNumberCell, ogNumberCell)
                    return true
                } else {
                    globalMergeCount = 0;
                    return false
                }
            }
            break
        case "right":
            targetBgCell = findBgDiv(parseInt(col) + 1, row)
            targetNumberCell = findNumberCell(parseInt(col) + 1, row)
            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged !== "true") {
                    globalMergeCount++
                    merge(targetNumberCell, ogNumberCell)
                    return true
                } else {
                    globalMergeCount = 0;
                    return false
                }
            }
            break
        case "up":
            targetBgCell = findBgDiv(col, parseInt(row) - 1)
            targetNumberCell = findNumberCell(col, parseInt(row) - 1)
            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged !== "true") {
                    globalMergeCount++
                    merge(targetNumberCell, ogNumberCell)
                    return true
                } else {
                    globalMergeCount = 0;
                    return false
                }
            }
            break
    }
}
let isEnded = false;
const endGame = () => {
    console.log("End Game");
    isEnded = true;
}

function merge(targetNumberCell, ogNumberCell) {
    targetNumberCell.style.zIndex = "3";
    ogNumberCell.style.zIndex = "0";
    targetNumberCell.textContent = parseInt(ogNumberCell.textContent)*2;
    styleCell(targetNumberCell);
    targetNumberCell.dataset.merged = "true";
    ogNumberCell.dataset.merged = "true";
    setTimeout(() => {
        ogNumberCell.remove();
    }, 100)
}

function updateCellPosition(cell, col, row) {
    cell.style.translate = `calc((100% + var(--gap-width))*${col}) calc((100% + var(--gap-width))*${row})`;
    cell.style.zIndex = "0";
}

function resetAllCellStatusAfterMove() {
    const cellsArr = document.querySelectorAll(".cell");
    [...cellsArr].forEach(cell => {
        cell.dataset.merged = "false"
    })
}

const gameStateArr = [];

const backgroundContainer = document.querySelector(".background-container")

const saveGameState = () => {
    setTimeout(() => {
        gameStateArr.push(backgroundContainer.innerHTML)
        console.log(gameStateArr)
    }, 200)
}
const loadPreviousGameState = () => {
    backgroundContainer.innerHTML = gameStateArr[gameStateArr.length - 2];
}

let isThrottled = false;

document.addEventListener("keydown", e => {
    if (isEnded) return

    if (!isThrottled) {
        isThrottled = true;

        switch (e.key) {
            case "ArrowLeft":
                if (moveLeft()) {
                    globalMergeCount = 0;
                    resetAllCellStatusAfterMove();
                    if (!generateRandomCell()) {
                        endGame();
                    }
                    saveGameState();
                } else {
                    isThrottled = false
                }
                break
            case "ArrowRight":
                if (moveRight()) {
                    globalMergeCount = 0;
                    resetAllCellStatusAfterMove();
                    if (!generateRandomCell()) {
                        endGame();
                    }
                    saveGameState();
                } else {
                    isThrottled = false
                }
                break
            case "ArrowUp":
                if (moveUp()) {
                    globalMergeCount = 0;
                    resetAllCellStatusAfterMove();
                    if (!generateRandomCell()) {
                        endGame();
                    }
                    saveGameState();
                } else {
                    isThrottled = false
                }
                break
            case "ArrowDown":
                if (moveDown()) {
                    globalMergeCount = 0;
                    resetAllCellStatusAfterMove();
                    if (!generateRandomCell()) {
                        endGame();
                    }
                    saveGameState();
                } else {
                    isThrottled = false
                }
                break
        }

        setTimeout(() => {
            isThrottled = false
        }, 200)
    }
})

let initialX, initialY;
document.addEventListener("touchstart", e => {
    e.preventDefault();

    const touch = e.touches[0];
    initialX = touch.clientX;
    initialY = touch.clientY;
})
document.addEventListener("touchmove", e => {
    e.preventDefault();

    const touch = e.changedTouches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;

    console.log("initialY", initialY, "currentY", currentY)

    const swipeLeft = currentX - initialX < -100 && Math.abs(currentY - initialY) < 20
    const swipeDown = currentY - initialY > 100 && Math.abs(currentX - initialX) < 20
    const swipeUp = currentY - initialY < -100 && Math.abs(currentX - initialX) < 20
    const swipeRight =  currentX - initialX > 100 && Math.abs(currentY - initialY) < 20

    const leftArrowEvent = new KeyboardEvent("keydown", {key: "ArrowLeft"})
    const downArrowEvent = new KeyboardEvent("keydown", {key: "ArrowDown"})
    const upArrowEvent = new KeyboardEvent("keydown", {key: "ArrowUp"})
    const rightArrowEvent = new KeyboardEvent("keydown", {key: "ArrowRight"})

    if(swipeLeft) {
        document.dispatchEvent(leftArrowEvent)
    } else if (swipeDown) {
        document.dispatchEvent(downArrowEvent)
    } else if (swipeUp) {
        console.log("detected swiping up")
        document.dispatchEvent(upArrowEvent)
    } else if (swipeRight) {
        console.log("detected swiping right")
        document.dispatchEvent(rightArrowEvent)
    }
}, {passive: false})

generateRandomCell()