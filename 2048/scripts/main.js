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

    movableCellArr.forEach(movableCell => {
        checkLeft(movableCell, movableCell.dataset.col, movableCell.dataset.rol);
    })

    console.log(movableCellArr);
}

const checkLeft = (ogCell, ogCol, ogRow) => {
    const backgroundCellToLeft = [...ALL_BACKGROUND_CELL_DIVS].filter(backgroundCell => backgroundCell.dataset.col == `${parseInt(ogCol) - 1}` && backgroundCell.dataset.row == `${parseInt(ogRow)}`)

    console.log(backgroundCellToLeft);
    if (backgroundCellToLeft.dataset.isEmpty === "false") {
        //if the background cell to left is not empty
        const cellToLeft = backgroundCellToLeft.querySelector(".cell")
        if (ogCell.textContent == cellToLeft.textContent) {
            //check the text of the cell to the left
            //if it is equal, combine it
            combineLeft(ogCell, cellToLeft);
            return true
        } else {
            //if it is not equal, do not combine it
            return false
        }
    } else {
        //the background cell to left is empty
        console.log("moving to left")
        return true
    }

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