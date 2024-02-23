const tierContainers = document.querySelectorAll(".tier-container");
const tierBrackets = document.querySelectorAll(".tier-bracket")
const participants = document.querySelectorAll(".participant");
const settings = document.querySelectorAll(".setting");
const moveControls = document.querySelectorAll(".move-row");
const brackets = document.querySelector(".brackets")
const tierNames = document.querySelectorAll(".tier-name")
const body = document.getElementById("body")

const defaultColorsForTier = [
    "#ff7f7f",
    "#ffbf7f",
    "#ffdf7f",
    "#ffff7f",
    "#bfff7f",
    "#7fff7f",
    "#7fffff",
    "#7fbfff",
    "#7f7fff",
    "#ff7fff"
]

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

    return indexOfTargetElement;
}

settings.forEach( setting => {
    setting.addEventListener("click", event => {
        const currentTierBracket = setting.parentNode;
        const currentTierName = currentTierBracket.querySelector(".tier-name");

        const boxOfSetting = setting.getBoundingClientRect();
        const settingLeft = parseInt(boxOfSetting.left);
        const settingTop = parseInt(boxOfSetting.top);


        const tempEditPopUp = document.createElement("div");
        tempEditPopUp.style.position = "fixed";
        tempEditPopUp.style.top = "50%"
        tempEditPopUp.style.left = "50%"
        tempEditPopUp.style.transform = "translate(-50%, -50%)"
        // tempEditPopUp.style.left = `${settingLeft}px`;
        // tempEditPopUp.style.top = `${settingTop}px`;
        tempEditPopUp.style.width = "clamp(50vw, 60vw ,90vw)";
        tempEditPopUp.style.minHeight = "50vh";
        tempEditPopUp.style.backgroundColor = "white";
        tempEditPopUp.style.zIndex = "5";

        setting.insertAdjacentElement("beforebegin", tempEditPopUp);
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

tierNames.forEach( (tierName, index) => {
    if(defaultColorsForTier[index]) {
        tierName.style.backgroundColor = defaultColorsForTier[index]
    }
})