const tierContainers = document.querySelectorAll(".tier-container");
const tierBrackets = document.querySelectorAll(".tier-bracket")
const participants = document.querySelectorAll(".participant");
const settings = document.querySelectorAll(".setting");
const moveControls = document.querySelectorAll(".move-row");
const brackets = document.querySelector(".brackets")


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

        const imgElementBeingDragged = document.querySelector(".participant.dragging")
        const tierBracketElementBeingDragged = document.querySelector(".tier-bracket.dragging")
        if (imgElementBeingDragged){
            const indexOfTargetElement = getIndexToInsert(tierContainer, event.clientX, event.clientY);
    
            if (tierContainer.children[indexOfTargetElement]) {
                const afterElement = tierContainer.children[indexOfTargetElement];
                tierContainer.insertBefore(imgElementBeingDragged, afterElement);
            } else {
                tierContainer.append(imgElementBeingDragged);
            }
        } else if (tierBracketElementBeingDragged) {
            const indexOfTargetElement = getIndexToInsert(brackets, event.clientX, event.clientY);
    
            if (brackets.children[indexOfTargetElement]) {
                const afterElement = brackets.children[indexOfTargetElement];
                brackets.insertBefore(tierBracketElementBeingDragged, afterElement);
            } else {
                brackets.append(tierBracketElementBeingDragged);
            }
        }
    })
})

function getIndexToInsert(container, clientX, clientY) {
    const elementsInThisContainer = [...container.children]
    const propertiesOfElements = elementsInThisContainer.map(element => {
        const boxOfThisElement = element.getBoundingClientRect();
        return {x: boxOfThisElement.x, y: boxOfThisElement.y, height: boxOfThisElement.height, width: boxOfThisElement.width}
    })

    let indexOfTargetElement = 999;

    for (const property of propertiesOfElements) {
        if (elementsInThisContainer[0].className.includes("participant")) {
            if (clientX - property.x - property.width/2 < 0 && clientY - property.y - property.height/1.2 < 0) {
                indexOfTargetElement = propertiesOfElements.indexOf(property);
                break
            } else if (clientX - property.x - property.width/2 > 0 && clientY - property.y < 0) {
                indexOfTargetElement = propertiesOfElements.indexOf(property);
                break
            }
        } else if (elementsInThisContainer[0].className.includes("tier")) {
            if (clientY - property.y - property.height/2 < 0) {
                indexOfTargetElement = propertiesOfElements.indexOf(property);
                break
            } else if (clientY - property.y < 0) {
                indexOfTargetElement = propertiesOfElements.indexOf(property);
                break
            }
        }
    }

    console.log(indexOfTargetElement);

    return indexOfTargetElement;
}

settings.forEach( setting => {
    setting.addEventListener("click", event => {
        const currentTierBracket = event.target.parent.parent;
    })
})

tierBrackets.forEach( tierBracket => {
    tierBracket.addEventListener("dragstart", () => {
        tierBracket.classList.add("dragging");
    })
    tierBracket.addEventListener("dragend", () => {
        tierBracket.classList.remove("dragging");
    })
})