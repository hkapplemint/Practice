import PlugBuilder from "./BuildPlug.js";

const plugs = document.querySelectorAll(".plug");
const plugboardContainer = document.querySelector(".plugboard-container");

const globalPlugArr = [];
export const globalLetterUsed = [];

const handlePlugDragStart = (e) => {
    //clear all first plugs with firstLetter dataset
    [...plugs].forEach((plug) => plug.dataset.firstLetter = undefined);

    const firstLetter = e.target.textContent;

    //setting the plug's dataset which the user dragstart on to its on letter
    //e.g. K plug will have a data-first-letter="K" in html
    e.target.dataset.firstLetter = firstLetter;
}
const handlePlugDragDrop = (e) => {
    const secondLetter = e.target.textContent;

    //to get the firstLetter by finding through all the plugs.
    //if the plug element's data-first-letter value is equal to its textContent, return that element. Then immediately access its textContent value and bind it to firstLetter
    const firstLetter = [...plugs].find((plug) => plug.dataset.firstLetter === plug.textContent).textContent;

    //the user drag and drop the same letter, return out
    if (firstLetter === secondLetter) return

    //the user tried to drag / drop plug that is already in used
    if (globalLetterUsed.includes(firstLetter) || globalLetterUsed.includes(secondLetter)) return

    const newPlug = new PlugBuilder()
        .setFirstLetter(firstLetter)
        .setSecondLetter(secondLetter)
        .build();

    //add the letters to the "used" array
    globalLetterUsed.push(firstLetter);
    globalLetterUsed.push(secondLetter);

    globalPlugArr.push(newPlug);
}

plugs.forEach((plug) => {
    plug.addEventListener("dragstart", handlePlugDragStart);
    plug.addEventListener("drop", handlePlugDragDrop);
})

plugboardContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
})