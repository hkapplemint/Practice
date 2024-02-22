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

        const indexOfTargetElement = getIndexToInsert(tierContainer, event.clientX, event.clientY);

        if (tierContainer.children[indexOfTargetElement]) {
            const afterElement = tierContainer.children[indexOfTargetElement];
            tierContainer.insertBefore(elementBeingDragged, afterElement);
        } else {
            tierContainer.append(elementBeingDragged);
        }
    })
})

function getIndexToInsert(container, clientX, clientY) {
    const elementsInThisContainer = [...container.querySelectorAll(".participant")]

    const propertiesOfElements = elementsInThisContainer.map(element => {
        const boxOfThisElement = element.getBoundingClientRect();
        return {x: boxOfThisElement.x, y: boxOfThisElement.y, height: boxOfThisElement.height, width: boxOfThisElement.width}
    })

    let indexOfTargetElement = 999;

    for (const property of propertiesOfElements) {
        if (clientX - property.x - property.width/2 < 0 && clientY - property.y - property.height/1.2 < 0) {
            indexOfTargetElement = propertiesOfElements.indexOf(property);
            break
        } else if (clientX - property.x - property.width/2 > 0 && clientY - property.y < 0) {
            indexOfTargetElement = propertiesOfElements.indexOf(property);
            break
        }
    }

    console.log(indexOfTargetElement);

    return indexOfTargetElement;
}
