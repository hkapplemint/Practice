const ALL_BACKGROUND_CELL_DIVS = document.querySelectorAll(".background-cell")

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
    }, 350)

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
        .sort((a, b) => parseInt(a.dataset.col) - parseInt(b.dataset.col))
    //.sort((a, b) => a.dataset.col - b.dataset.col) is to sort all the filtered cell into ascending order in terms of its column value
    //in the following .forEach method, we want to iterate the left most (i.e. smallest column value) cell first.

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
        .sort((a, b) => parseInt(b.dataset.row) - parseInt(a.dataset.row))

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

function directionIsEmptyOrEqual(col, row, direction) {
    let targetBgCell, targetNumberCell;
    const ogNumberCell = findNumberCell(col, row);
    switch (direction) {
        case "left":
            console.log(globalMergeCount)

            targetBgCell = findBgDiv(parseInt(col)-1, row)
            targetNumberCell = findNumberCell(parseInt(col)-1, row)

            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged === "false") {
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
            console.log(globalMergeCount)

            targetBgCell = findBgDiv(col, parseInt(row) + 1)
            targetNumberCell = findNumberCell(col, parseInt(row) + 1)
            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    globalMergeCount = 0;
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent && targetNumberCell.dataset.merged === "false") {
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

const endGame = () => {
    console.log("End Game")
}

function merge(targetNumberCell, ogNumberCell) {
    targetNumberCell.style.zIndex = "3";
    targetNumberCell.textContent = parseInt(ogNumberCell.textContent)*2;
    targetNumberCell.dataset.merged = "true";
    setTimeout(() => {
        ogNumberCell.remove();
    }, 500)
}

function updateCellPosition(cell, col, row) {
    cell.style.translate = `calc((100% + var(--gap-width))*${col}) calc((100% + var(--gap-width))*${row})`
}

function resetAllCellMergedStatus() {
    const cellsArr = document.querySelectorAll(".cell");
    [...cellsArr].forEach(cell => cell.dataset.merged = "false")
}

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowLeft":
            if (moveLeft()) {
                globalMergeCount = 0;
                resetAllCellMergedStatus();
                if (!generateRandomCell()) {
                    endGame();
                }
            }
            break
        case "ArrowRight":
            break
        case "ArrowUp":
            break
        case "ArrowDown":
            if (moveDown()) {
                globalMergeCount = 0;
                resetAllCellMergedStatus();
                if (!generateRandomCell()) {
                    endGame();
                }
            }
            break
    }
})

generateRandomCell()