const tierContainers = document.querySelectorAll(".tier-container");
const participants = document.querySelectorAll(".participant");

participants.forEach( participant => {
    participant.addEventListener("dragstart", () => {
        participant.classList.add("dragging");
    })

    participant.addEventListener("dragend", () => {
        participant.classList.remove("dragging");
    })
})

tierContainers.forEach( tierContainer => {
    tierContainer.addEventListener("dragover", event => {
        event.preventDefault();

        const elementBeingDragged = document.querySelector(".participant.dragging")

        const afterElement = getDragAfterElement(tierContainer, event.clientX, event.clientY);
        
        if (afterElement == null) {
            tierContainer.append(elementBeingDragged);
        } else {
            tierContainer.insertBefore(elementBeingDragged, afterElement);
        }

    })
})

function getDragAfterElement(container, x, y) {
    const elementsInThisContainerNotBeingDragged = [...container.querySelectorAll(".participant:not(.dragging)")]

    const elementToReturn = elementsInThisContainerNotBeingDragged.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offsetX = x - box.x - box.width/2;
        const offsetY = y - box.y - box.height;

        if (offsetX < 0 && offsetX > closest.offsetX && offsetY < 0 && offsetY > closest.offsetY) {
            return {offsetX: offsetX, offsetY: offsetY, element: child}
        } else {
            return closest
        }

    }, {offsetX: Number.NEGATIVE_INFINITY, offsetY: Number.NEGATIVE_INFINITY}).element;

    return elementToReturn;

    //return a single element that is the closest to the element being dragged
}












// const containers = document.querySelectorAll(".container")
// const draggables = document.querySelectorAll(".draggable")

// draggables.forEach(draggable => {
//     draggable.addEventListener("dragstart", () => {
//         draggable.classList.add("dragging");
//     })

//     draggable.addEventListener("dragend", () => {
//         draggable.classList.remove("dragging");
//     })
// })

// containers.forEach(container => {
//     container.addEventListener("dragover", event => {
//         event.preventDefault();
//         const afterElement = getDragAfterElement(container, event.clientY)
//         const dragging = document.querySelector(".dragging");
        

//         if (afterElement == null) {
//             container.append(dragging);
//         } else {
//             container.insertBefore(dragging, afterElement);
//         }

//     })
// })

// function getDragAfterElement(container, y) {
//     const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")]

//     return draggableElements.reduce((closest, child) => {
//         const box = child.getBoundingClientRect();
//         const offset = y - box.top - box.height/2;
//         if(offset < 0 && offset > closest.offset) {
//             return {offset: offset, element: child};
//         } else {
//             return closest
//         }

//     }, {offset: Number.NEGATIVE_INFINITY}).element
// }