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
    }, 300)

    return true;
}

const findBgDiv = (col, row) => {
    return [...ALL_BACKGROUND_CELL_DIVS].find(bgCell => bgCell.dataset.col == col && bgCell.dataset.row == row)
}
const findNumberCell = (col, row) => {
    return [...document.querySelectorAll(".cell")].find(cell => cell.dataset.col == col && cell.dataset.row == row)
}

const moveLeft = () => {
    const allCellArr = document.querySelectorAll(".cell");
    const allPossibleLeftMoveCellArr = [...allCellArr].filter(cell => cell.dataset.col !== "0")

    allPossibleLeftMoveCellArr.forEach(cell => {
        let col = cell.dataset.col;
        let row = cell.dataset.row;

        let respectiveBgCell = findBgDiv(col, row)
        let leftBgCell = findBgDiv(parseInt(col)-1, row)
        // console.log(respectiveBgCell);

        while (isDirectionEmptyOrEqual(col, row, "left")) {
            respectiveBgCell = findBgDiv(col, row)
            if(respectiveBgCell) {
                respectiveBgCell.dataset.isEmpty = "true"
            }

            cell.dataset.col = parseInt(cell.dataset.col) - 1;
            col = cell.dataset.col;
            
            leftBgCell = findBgDiv(col, row)
            if(leftBgCell) {
                leftBgCell.dataset.isEmpty = "false"
            }
                

            console.log("cell:", cell, "is moving left")
        }

        updateCellPosition(cell, cell.dataset.col, cell.dataset.row)
    })
}
function merging(targetNumberCell, ogNumberCell) {
    targetNumberCell.textContent = parseInt(targetNumberCell.textContent)*2;
    ogNumberCell.remove();
}

function updateCellPosition(cell, col, row) {
    cell.style.translate = `calc((100% + var(--gap-width))*${col}) calc((100% + var(--gap-width))*${row})`
}

function isDirectionEmptyOrEqual(col, row, direction) {
    let targetBgCell, targetNumberCell, targetNextNumberCell;
    const ogNumberCell = findNumberCell(col, row);
    switch (direction) {
        case "left":
            targetBgCell = findBgDiv(parseInt(col)-1, row)
            targetNumberCell = findNumberCell(parseInt(col)-1, row)
            targetNextNumberCell = findNumberCell(parseInt(col)-2, row)
            if(targetBgCell) {
                if(targetBgCell.dataset.isEmpty === "true") {
                    return true
                } else if(targetNumberCell.textContent == ogNumberCell.textContent) {
                    if (targetNextNumberCell && targetNextNumberCell?.textContent == ogNumberCell.textContent) {
                        return false
                    }
                    //***need more work on this
                    //found bug: 4 4 4 --> all three will merge together and become 16


                    console.log("Found matching number, merging")
                    setTimeout(() => {
                        merging(targetNumberCell, ogNumberCell)
                    }, 500)
                    return true
                } else {
                    return false
                }
            }
    }
}

const endGame = () => {
    console.log("End Game")
}

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            if (!generateRandomCell()) {
                endGame();
            }
            break
        case "ArrowRight":
            break
        case "ArrowUp":
            break
        case "ArrowDown":
            break
    }
})

generateRandomCell()



// const moveLeft = () => {
//     const movableCellDivs = [...ALL_BACKGROUND_CELL_DIVS].filter(backgroundCell => backgroundCell.dataset.col !== "0" && backgroundCell.dataset.isEmpty === "false")

//     if(movableCellDivs.length === 0) return false

//     const movableCellArr = [];
//     movableCellDivs.forEach(movableCellDiv => {
//         const movableCell  = movableCellDiv.querySelector(".cell");
//         movableCellArr.push(movableCell);
//     })

//     if(movableCellArr.length !== 0) {
//         movableCellArr.forEach(movableCell => {
//             let count = 0;
//             const isLeftClear = (ogCell, ogCol, ogRow) => {
//                 const backgroundCellToLeft = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col == `${parseInt(ogCol) - 1}` && backgroundCell.dataset.row == `${parseInt(ogRow)}`)
                
//                 if(backgroundCellToLeft === undefined) return
            
//                 if (backgroundCellToLeft.dataset.isEmpty === "false") {
//                     //if the background cell to left is not empty
//                     const cellToLeft = backgroundCellToLeft.querySelector(".cell")
//                     if (ogCell.textContent == cellToLeft.textContent) {
//                         //check the text of the cell to the left
//                         //if it is equal, combine it
//                         count++
//                         combineLeft(cellToLeft, ogCell);
//                         return
//                     } else { //left side is not empty and its number is different from ogCell
//                         return
//                     }
            
//                 } else { //the background cell to left is empty
//                     backgroundCell = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col === ogCell.dataset.col && backgroundCell.dataset.row === ogRow);
//                     backgroundCell.dataset.isEmpty = "true";
            
//                     console.log(backgroundCell);
            
//                     ogCell.dataset.col = `${ogCol - 1}`;
//                     backgroundCellToLeft.dataset.isEmpty = "false";
            
//                     setTimeout(() => {
//                         backgroundCellToLeft.append(ogCell);
//                     }, 500)
            
//                     count++;
//                     isLeftClear(ogCell, ogCell.dataset.col, ogRow);
//                 }
//             }

//             isLeftClear(movableCell, movableCell.dataset.col, movableCell.dataset.row)

//             movableCell.style.transform = `translateX(calc(-100% - var(--gap-width))*count)`
//             console.log(movableCell)
//             console.log(count);
//         })
    
//     }

// }


// function combineLeft(cellToLeft, ogCell) {
//     cellToLeft.textContent = parseInt(cellToLeft.textContent) + parseInt(ogCell.textContent);

//     ogBackgroundCell = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col === ogCell.dataset.col && backgroundCell.dataset.row === ogCell.dataset.row)
//     ogBackgroundCell.dataset.isEmpty = "true";

//     ogCell.style.zIndex = "0";
//     setTimeout(() => {
//         ogCell.remove();
//     }, 200)
// }