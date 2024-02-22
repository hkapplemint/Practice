const containers = document.querySelectorAll(".container")
const draggables = document.querySelectorAll(".draggable")

draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", () => {
        draggable.classList.add("dragging");
    })

    draggable.addEventListener("dragend", () => {
        draggable.classList.remove("dragging");
    })
})

containers.forEach(container => {
    container.addEventListener("dragover", event => {
        event.preventDefault();
        const afterElement = getDragAfterElement(container, event.clientY)
        const dragging = document.querySelector(".dragging");
        container.append(dragging);
        
        console.log(afterElement);

        if (afterElement == null) {
            container.append(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }

    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;

        if(offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child};
        } else {
            return closest
        }

    }, {offset: Number.NEGATIVE_INFINITY}).element
}