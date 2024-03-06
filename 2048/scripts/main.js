const ALL_BACKGROUND_CELL_DIVS = document.querySelectorAll(".background-cell")

const generateRandomCell = () => {
    //get all empty cells
    //randomly choose one of the empty cell
    //create a new element and append to that empty cell
    const emptyCellsDivArr = [...ALL_BACKGROUND_CELL_DIVS].filter(backgroundCell => backgroundCell.dataset.isEmpty === "true")

    //guard clause: if there is no empty cell in the game, return
    if (emptyCellsDivArr.length === 0) return false;

    const randomCellDiv = emptyCellsDivArr[Math.floor(Math.random()*emptyCellsDivArr.length)]
    
    const newElement = document.createElement("div")
    newElement.classList.add("cell");
    //70% to be a 2, 30% to be a 4
    newElement.textContent = Math.random() > 0.3 ? 2 : 4;
    newElement.dataset.col = randomCellDiv.dataset.col;
    newElement.dataset.row = randomCellDiv.dataset.row;

    randomCellDiv.append(newElement);

    //mark this chosen cell to be NOT empty
    randomCellDiv.dataset.isEmpty = "false";

    setTimeout(() => {
        newElement.style.scale = "1"
    }, 500);

    return true;
}

const moveLeft = () => {
    const movableCellDivs = [...ALL_BACKGROUND_CELL_DIVS].filter(backgroundCell => backgroundCell.dataset.col !== "0" && backgroundCell.dataset.isEmpty === "false")

    if(movableCellDivs.length === 0) return false

    const movableCellArr = [];
    movableCellDivs.forEach(movableCellDiv => {
        const movableCell  = movableCellDiv.querySelector(".cell");
        movableCellArr.push(movableCell);
    })

    if(movableCellArr.length !== 0) {
        movableCellArr.forEach(movableCell => {
            let count = 0;
            const isLeftClear = (ogCell, ogCol, ogRow) => {
                const backgroundCellToLeft = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col == `${parseInt(ogCol) - 1}` && backgroundCell.dataset.row == `${parseInt(ogRow)}`)
                
                if(backgroundCellToLeft === undefined) return
            
                if (backgroundCellToLeft.dataset.isEmpty === "false") {
                    //if the background cell to left is not empty
                    const cellToLeft = backgroundCellToLeft.querySelector(".cell")
                    if (ogCell.textContent == cellToLeft.textContent) {
                        //check the text of the cell to the left
                        //if it is equal, combine it
                        count++
                        combineLeft(cellToLeft, ogCell);
                        return
                    } else { //left side is not empty and its number is different from ogCell
                        return
                    }
            
                } else { //the background cell to left is empty
                    backgroundCell = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col === ogCell.dataset.col && backgroundCell.dataset.row === ogRow);
                    backgroundCell.dataset.isEmpty = "true";
            
                    console.log(backgroundCell);
            
                    ogCell.dataset.col = `${ogCol - 1}`;
                    backgroundCellToLeft.dataset.isEmpty = "false";
            
                    setTimeout(() => {
                        backgroundCellToLeft.append(ogCell);
                    }, 500)
            
                    count++;
                    isLeftClear(ogCell, ogCell.dataset.col, ogRow);
                }
            }

            isLeftClear(movableCell, movableCell.dataset.col, movableCell.dataset.row)

            movableCell.style.transform = `translateX(calc(-100% - var(--gap-width))*count)`
            console.log(movableCell)
            console.log(count);
        })
    
    }

}


function combineLeft(cellToLeft, ogCell) {
    cellToLeft.textContent = parseInt(cellToLeft.textContent) + parseInt(ogCell.textContent);

    ogBackgroundCell = [...ALL_BACKGROUND_CELL_DIVS].find(backgroundCell => backgroundCell.dataset.col === ogCell.dataset.col && backgroundCell.dataset.row === ogCell.dataset.row)
    ogBackgroundCell.dataset.isEmpty = "true";

    ogCell.style.zIndex = "0";
    setTimeout(() => {
        ogCell.remove();
    }, 200)
}

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowLeft":
            moveLeft();
            generateRandomCell();
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