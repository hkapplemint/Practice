function directionIsEmptyOrEqual(col, row, direction) {
    let targetBgCell, targetNumberCell;
    const ogNumberCell = findNumberCell(col, row);
    switch (direction) {
        case "left":
            targetBgCell = findBgDiv(parseInt(col)-1, row)
            targetNumberCell = findNumberCell(parseInt(col)-1, row)
            break
        case "down":
            targetBgCell = findBgDiv(col, parseInt(row) + 1)
            targetNumberCell = findNumberCell(col, parseInt(row) + 1)
            break
        case "right":
            targetBgCell = findBgDiv(parseInt(col) + 1, row)
            targetNumberCell = findNumberCell(parseInt(col) + 1, row)
            break
        case "up":
            targetBgCell = findBgDiv(col, parseInt(row) - 1)
            targetNumberCell = findNumberCell(col, parseInt(row) - 1)
            break       
    }
    
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
}