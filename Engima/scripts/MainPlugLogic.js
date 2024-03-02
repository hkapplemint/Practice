import PlugBuilder from "./BuildPlug.js";

const plugs = document.querySelectorAll(".plug");
const plugboardContainer = document.querySelector(".plugboard-container");


export const globalPlugArr = [];
const globalLetterUsedArr = [];
const colorPairs = [];

const handlePlugDragStart = (e) => {
    //clear all first plugs with firstLetter dataset
    [...plugs].forEach((plug) => plug.dataset.firstLetter = undefined);

    const firstLetter = e.target.textContent;

    //setting the plug's dataset which the user dragstart on to its on letter
    //e.g. K plug will have a data-first-letter="K" in html
    e.target.dataset.firstLetter = firstLetter;

    e.target.classList.add("dragging");
}
const handlePlugDragEnd = (e) => {
    e.target.classList.remove("dragging");
}

const handlePlugDragDrop = (e) => {
    const secondLetter = e.target.textContent;
    
    //to get the firstLetter by finding through all the plugs.
    //if the plug element's data-first-letter value is equal to its textContent, return that element
    const firstLetterPlug = [...plugs].find((plug) => plug.dataset.firstLetter === plug.textContent);
    const firstLetter = firstLetterPlug.textContent;

    //the user drag and drop the same letter, return out
    if (firstLetter === secondLetter) return
    
    //the user tried to drag / drop plug that is already in used
    if (globalLetterUsedArr.includes(firstLetter) || globalLetterUsedArr.includes(secondLetter)) return

    firstLetterPlug.classList.add("plugged");
    e.target.classList.add("plugged");

    //draw a line to connect the centers of the two plugs
    drawLineBetweenTwoPlugs(firstLetterPlug, e.target);

    const newPlug = new PlugBuilder()
        .setFirstLetter(firstLetter)
        .setSecondLetter(secondLetter)
        .build();

    //add the letters to the "used" array
    globalLetterUsedArr.push(firstLetter);
    globalLetterUsedArr.push(secondLetter);

    return newPlug;
}

const drawLineBetweenTwoPlugs = (element1, element2) => {
    const plugboardSvg = document.getElementById("plugboard-svg");

    const svgBox = plugboardSvg.getBoundingClientRect();
    const box1 = element1.getBoundingClientRect();
    const box2 = element2.getBoundingClientRect();

    const x1 = box1.x + box1.width / 2;
    const y1 = box1.y - svgBox.y + box1.height/2;

    const x2 = box2.x + box2.width / 2;
    const y2 = box2.y - svgBox.y + box2.height/2;

    plugboardSvg.innerHTML += `
    <line id="${element1.textContent}${element2.textContent}" class="line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="10" />
    `
}

const handlePlugClick = (e) => {
    e.stopPropagation();
    e.target.classList.remove("plugged");

    const letter = e.target.textContent;

    const targetPlugPairs = globalPlugArr.find(plugobj => plugobj["firstLetter"] === letter || plugobj["secondLetter"] === letter)


    if (targetPlugPairs) {

        const firstLetter = targetPlugPairs["firstLetter"];
        const secondLetter = targetPlugPairs["secondLetter"];

        const firstLetterIndex =  globalLetterUsedArr.indexOf(firstLetter);
        globalLetterUsedArr.splice(firstLetterIndex, 1); //remove first letter from used array
        const secondLetterIndex =  globalLetterUsedArr.indexOf(secondLetter);
        globalLetterUsedArr.splice(secondLetterIndex, 1); //remove second letter from used array
        
        if (firstLetter === letter) {
            const secondPlug = [...plugs].find(plug => plug.textContent === secondLetter);
            secondPlug.classList.remove("plugged")
        } else {
            const firstPlug = [...plugs].find(plug => plug.textContent === firstLetter);
            firstPlug.classList.remove("plugged")
        }

        //remove the line connecting the two plug
        const lines = document.querySelectorAll(".line");
        const targetLine = [...lines].find(line => line.id[0] === firstLetter);
        targetLine.remove();


        const plugIndex = globalPlugArr.indexOf(targetPlugPairs);
        //remove the targetPlugPairs from globalPlugArr;
        globalPlugArr.splice(plugIndex, 1);
    }
}

plugs.forEach((plug) => {
    plug.addEventListener("dragstart", handlePlugDragStart);
    plug.addEventListener("dragend", handlePlugDragEnd);

    plug.addEventListener("drop", (e) => {
        const newPlug = handlePlugDragDrop(e);
        if (newPlug) {
            globalPlugArr.push(newPlug);
            // colorAllPlugs(globalPlugArr);
        }
    })
    
    plug.addEventListener("click", handlePlugClick); //remove the plug pairs
})

plugboardContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
})