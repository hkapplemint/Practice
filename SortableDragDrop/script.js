let tierBrackets = document.querySelectorAll(".tier-bracket");
let tierNames = document.querySelectorAll(".tier-name");
let tierContainers = document.querySelectorAll(".tier-container");
let settings = document.querySelectorAll(".setting");
let participants = document.querySelectorAll(".participant");
const brackets = document.querySelector(".brackets");
const body = document.getElementById("body");
const tierNotRanked = document.getElementById("tier-not-ranked");
const editWrapper = document.getElementById("edit-wrapper");
const editDiv = document.getElementById("edit-div");
const editCloseBtn = document.getElementById("edit-close-btn");
const colorPicker = document.getElementById("color-picker");
const nameTextArea = document.getElementById("name-textarea");
const applyBtn = document.getElementById("option-apply");
const clearBtn = document.getElementById("option-clear");
const deleteBtn = document.getElementById("option-delete");
const addRowAboveBtn = document.getElementById("option-add-row-above");
const addRowBelowBtn = document.getElementById("option-add-row-below");
const imageUploadInput = document.getElementById("imageUpload");
const previewContainer = document.getElementById("previewContainer");
const uploadContainer = document.getElementById("upload-container");


["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    uploadContainer.addEventListener(eventName, preventDefaults);
    body.addEventListener(eventName, preventDefaults);
})

uploadContainer.addEventListener("dragenter", () => {
    uploadContainer.classList.add("highlight");
})
uploadContainer.addEventListener("dragover", () => {
    uploadContainer.classList.add("highlight");
})
uploadContainer.addEventListener("dragleave", () => {
    uploadContainer.classList.remove("highlight");
})
uploadContainer.addEventListener("click", (e) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.addEventListener("change", e => {
        handleFiles(e, fileInput)
    });
    fileInput.click();
})

uploadContainer.addEventListener("drop", (e) => {
    uploadContainer.classList.remove("highlight");
    handleFiles(e);
})

function handleFiles(e, fileInput = "") {

    let files;
    if (fileInput.files) {
        files = fileInput.files;
    } else if (e.dataTransfer.files) {
        files = e.dataTransfer.files;
    } else {
        return;
    }

    if(files.length > 0) {
        uploadContainer.innerHTML = "";

        for (let  i = 0; i < files.length; i++) {
            const file = files[i];

            const reader = new FileReader();

            reader.addEventListener("load", () => {
                const image = new Image();

                image.src = reader.result;
                image.classList.add("participant");
                image.draggable = true;
                

                tierNotRanked.append(image);

                participants = document.querySelectorAll(".participant");
                updateParticipants(participants);
            });

            reader.readAsDataURL(file);
        }
        
    }
}


function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}


let indexOfCurrentSetting = 999;

function closeAll() {
    editDiv.style.display = "none";
    editWrapper.style.display = "none";
}

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
];


function updateParticipants(participantArr) {
    participantArr.forEach( participant => {
        participant.addEventListener("dragstart", (event) => {
            event.stopPropagation();
            participant.classList.add("dragging");
        })
    
        participant.addEventListener("dragend", () => {
            participant.classList.remove("dragging");
        })
    })
}


function updateTierContainers(tierContainersArr) {
    tierContainersArr.forEach( tierContainer => {

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
}

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

function updateSettings(settingsArr) {
    settingsArr.forEach( setting => {
        setting.addEventListener("click", (event) => {
            
            editDiv.style.display = "flex";
            editWrapper.style.display = "block";
    
            nameTextArea.value = event.currentTarget.parentNode.querySelector(".tier-name").textContent

            function rbgToHex(rgbString) {
                if (rgbString === "") return `#ffffff`

                const rgbValues = rgbString.match(/\d+/g);
                const r = parseInt(rgbValues[0]);
                const g = parseInt(rgbValues[1]);
                const b = parseInt(rgbValues[2]);

                const red = r.toString(16).padStart(2, '0');
                const green = g.toString(16).padStart(2, '0');
                const blue = b.toString(16).padStart(2, '0');

                return `#${red}${green}${blue}`
            }

            colorPicker.value = rbgToHex(
                event.currentTarget.parentNode.querySelector(".tier-name").style.backgroundColor);
    
            const tierBrackets = event.currentTarget.parentNode.parentNode.children;
            indexOfCurrentSetting = [...tierBrackets].indexOf(event.currentTarget.parentNode);
        })
    })
}


function updateTierBrackets(tierBracketsArr) {
    tierBracketsArr.forEach( tierBracket => {
        tierBracket.addEventListener("dragstart", (event) => {
            tierBracket.classList.add("dragging");
        })
        tierBracket.addEventListener("dragend", () => {
            tierBracket.classList.remove("dragging");
        })
    })
}

tierNames.forEach( (tierName, index) => {
    if(defaultColorsForTier[index]) {
        tierName.style.backgroundColor = defaultColorsForTier[index]
    }
})

updateTierBrackets(tierBrackets);
updateTierContainers(tierContainers);
updateSettings(settings);
updateParticipants(participants);



editCloseBtn.addEventListener("click", () => {
    closeAll();
})

applyBtn.addEventListener("click", () => {
    const currentTierName = [...tierNames][indexOfCurrentSetting];
    currentTierName.textContent = nameTextArea.value;
    currentTierName.style.backgroundColor = colorPicker.value;
    closeAll();
})

clearBtn.addEventListener("click", () => {
    const currentTierContainer = [...tierContainers][indexOfCurrentSetting];
    const imgsInThisTier = [...currentTierContainer.children];

    imgsInThisTier.forEach( img => {
        tierNotRanked.append(img);
    })
    if (confirm("Clear row?")) {
        closeAll();
    }
})

deleteBtn.addEventListener("click", () => {
    const currentTierBracket = [...tierBrackets][indexOfCurrentSetting];
    const currentTierContainer = [...tierContainers][indexOfCurrentSetting];
    const currentTierName = [...tierNames][indexOfCurrentSetting];
    const imgsInThisTier = [...currentTierContainer.children];

    const userResponse = confirm(`This will delete Tier: ${currentTierName.textContent}. Confirm action?`)
    if (userResponse) {
        imgsInThisTier.forEach( img => {
            tierNotRanked.append(img);
        })
        currentTierBracket.remove();
        tierBrackets = document.querySelectorAll(".tier-bracket");
        tierNames = document.querySelectorAll(".tier-name");
        tierContainers = document.querySelectorAll(".tier-container");

        updateTierBrackets(tierBrackets);
        updateSettings(settings);

        closeAll();
    }
})

addRowAboveBtn.addEventListener("click", () => {
    const currentTierBracket = [...tierBrackets][indexOfCurrentSetting];
    const newTierBracket = document.createElement("div");
    newTierBracket.classList.add("tier-bracket");
    newTierBracket.draggable = true;
    newTierBracket.innerHTML = `
        <div class="tier-name"></div>
        <div class="tier-container"></div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="setting"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
    `
    brackets.insertBefore(newTierBracket, currentTierBracket);
    
    tierBrackets = document.querySelectorAll(".tier-bracket");
    tierNames = document.querySelectorAll(".tier-name");
    tierContainers = document.querySelectorAll(".tier-container");
    settings = document.querySelectorAll(".setting");

    updateTierBrackets(tierBrackets);
    updateTierContainers(tierContainers);
    updateSettings(settings);
    closeAll();
})

addRowBelowBtn.addEventListener("click", () => {
    const currentTierBracket = [...tierBrackets][indexOfCurrentSetting];
    const newTierBracket = document.createElement("div");
    newTierBracket.classList.add("tier-bracket");
    newTierBracket.draggable = true;
    newTierBracket.innerHTML = `
        <div class="tier-name"></div>
        <div class="tier-container"></div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" class="setting"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>
    `
    brackets.insertBefore(newTierBracket, currentTierBracket.nextSibling);
    
    tierBrackets = document.querySelectorAll(".tier-bracket");
    tierNames = document.querySelectorAll(".tier-name");
    tierContainers = document.querySelectorAll(".tier-container");
    settings = document.querySelectorAll(".setting");

    updateTierBrackets(tierBrackets);
    updateTierContainers(tierContainers);
    updateSettings(settings);
    closeAll();
})