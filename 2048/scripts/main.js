const ALL_BACKGROUND_CELLS = document.querySelectorAll(".background-cell")

const generateRandomCell = () => {
    const emptyCellsArr = [...ALL_BACKGROUND_CELLS].filter(backgroundCell => backgroundCell.dataset.isEmpty === "true")
    console.log(emptyCellsArr);
}

generateRandomCell()