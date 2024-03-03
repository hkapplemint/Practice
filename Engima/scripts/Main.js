import RotorBuilder from "./BuildRotor.js";
import EnigmaBuilder from "./BuildEnigma.js";
import PlugBuilder from "./BuildPlug.js";
import {globalPlugArr} from "./MainPlugLogic.js"

const scrambleArr1 = [11, 24, 16, -2, 15, 16, 2, -5, 6, 4, -6, 11, 12, 10, -7, -15, 1, -12, -9, -9, -5, -5, -16, -11, -21, -5];
const scrambleArr2 = [16, 7, 5, 7, 7, 1, -4, -3, 14, -9, 9, 10, -11, 11, 4, -1, 1, -8, -15, 6, 3, -6, -9, -3, -12, -20];
const scrambleArr3 = [24, 21, 21, -1, 17, 13, -6, -1, 17, 10, -6, 6, 1, -12, 6, -3, -2, -14, -11, -10, -12, -11, -6, -12, -19, -10];
const scrambleArr4 = [22, 17, 5, 1, 19, 9, 13, -6, -2, -9, 1, 10, 1, -11, 3, -5, 4, -8, -3, -7, -4, 4, 2, -18, -16, -22]
const scrambleArr5 = [5, 22, 4, 22, -1, -1, 2, 15, 1, 6, 14, 6, 1, -3, 5, -1, -9, -1, -7, -17, 1, -1, -21, -23, -6, -13]

const ringNotch1 = 1;
const ringNotch2 = 13;
const ringNotch3 = 7;
const ringNotch4 = 5;
const ringNotch5 = 23;



const rotorA = new RotorBuilder()
    .setScrambleArr(scrambleArr1)
    .setRingNotch(ringNotch1)
    .setStartingNumber(24)
    .setName("rotorA");
const rotorB = new RotorBuilder()
    .setScrambleArr(scrambleArr2)
    .setRingNotch(ringNotch2)
    .setStartingNumber(6)
    .setName("rotorB");
const rotorC = new RotorBuilder()
    .setScrambleArr(scrambleArr3)
    .setRingNotch(ringNotch3)
    .setStartingNumber(4)
    .setName("rotorC");
const rotorD = new RotorBuilder()
    .setScrambleArr(scrambleArr4)
    .setRingNotch(ringNotch4)
    .setStartingNumber(10)
    .setName("rotorD");
const rotorE = new RotorBuilder()
    .setScrambleArr(scrambleArr5)
    .setRingNotch(ringNotch5)
    .setStartingNumber(19)
    .setName("rotorE");

const globalRotorArr = [
    {rotorObj: rotorA, rotorName: "rotorA", rotorInUse: true},
    {rotorObj: rotorB, rotorName: "rotorB", rotorInUse: true},
    {rotorObj: rotorC, rotorName: "rotorC", rotorInUse: true},
    {rotorObj: rotorD, rotorName: "rotorD", rotorInUse: false},
    {rotorObj: rotorE, rotorName: "rotorE", rotorInUse: false},
];

const enigma = new EnigmaBuilder()
    .setRotor1(rotorA)
    .setRotor2(rotorB)
    .setRotor3(rotorC)








const keys = document.querySelectorAll(".key");
const lights = document.querySelectorAll(".light");
const decryptionContainer = document.querySelector(".decryption-container");
const rotorOne = document.getElementById("rotor1");
const rotorOneCurrentNumber = document.getElementById("rotor1-current-number");
const rotorTwo = document.getElementById("rotor2");
const rotorTwoCurrentNumber = document.getElementById("rotor2-current-number");
const rotorThree = document.getElementById("rotor3");
const rotorThreeCurrentNumber = document.getElementById("rotor3-current-number");
const nextNumberDivs = document.querySelectorAll(".next-number");
const previousNumberDivs = document.querySelectorAll(".previous-number");

const createRotorDropDownMenu = (parentElement) => {
    //add current rotor's name as the first p element of the dropdown
    let currentRotorName;
    switch (parentElement.parentElement.id) {
        case "rotor1":
            currentRotorName = enigma.enigma.rotor1.rotor.name;
            break
        case "rotor2":
            currentRotorName = enigma.enigma.rotor2.rotor.name;
            break
        case "rotor3":
            currentRotorName = enigma.enigma.rotor3.rotor.name;
            break
    }
    const currentRotor = document.createElement("p");
    currentRotor.classList.add("current-rotor");
    currentRotor.textContent = currentRotorName;
    parentElement.append(currentRotor);

    //add the available rotors' name as the subsequent p elements to the dropdown
    const availableRotorArr = globalRotorArr.filter((obj) => obj.rotorInUse === false)

    availableRotorArr.forEach((obj) => {
        const pEle = document.createElement("p");
        pEle.classList.add("available-rotor");
        pEle.textContent = obj.rotorName;

        parentElement.append(pEle)
    })
}

const updateCurrentNumberDisplay = () => {
    rotorOneCurrentNumber.textContent = enigma.enigma.rotor1.rotor.currentNumber + 1
    rotorTwoCurrentNumber.textContent = enigma.enigma.rotor2.rotor.currentNumber + 1
    rotorThreeCurrentNumber.textContent = enigma.enigma.rotor3.rotor.currentNumber + 1
}

let isDropDownShowing = false;

const handleRotorClick = (e) => {
    //availableRotorsEle is the div element that act as a drop down menu
    const availableRotorsEle = e.currentTarget.parentElement.querySelector(".available-rotors");

    if (availableRotorsEle.style.display === "block") {
        //user clicked on a rotor that is currently showing the dropdown menu
        //this action closes the dropdown menu
        //setting isDropDownShowing = false to allow user to click on other rotors
        availableRotorsEle.style.display = "none"
        isDropDownShowing = false;
        return
    } else if (availableRotorsEle.style.display = "none" && !isDropDownShowing) {
        //user clicked on a rotor this is not showing a dropdown menu
        //the "!isDropDownShowing" check make sure there is no other active drop down menu
        availableRotorsEle.style.display = "block"
        isDropDownShowing = true;
    }

    availableRotorsEle.innerHTML = "";
    //create the dropdown menu containing unused rotor
    createRotorDropDownMenu(availableRotorsEle);
    
    const switchRotor = (currentRotorEle, newRotorObj) => {
        console.log(currentRotorEle.id);
        switch (currentRotorEle.id) {
            case "rotor1":
                globalRotorArr.find((obj) => obj.rotorName === enigma.enigma.rotor1.rotor.name).rotorInUse = false;
                enigma.setRotor1(newRotorObj);
                globalRotorArr.find((obj) => obj.rotorObj === newRotorObj).rotorInUse = true;
                break
            case "rotor2":
                globalRotorArr.find((obj) => obj.rotorName === enigma.enigma.rotor2.rotor.name).rotorInUse = false;
                enigma.setRotor2(newRotorObj);
                globalRotorArr.find((obj) => obj.rotorObj === newRotorObj).rotorInUse = true;
                break
            case "rotor3":
                globalRotorArr.find((obj) => obj.rotorName === enigma.enigma.rotor3.rotor.name).rotorInUse = false;
                enigma.setRotor3(newRotorObj);
                globalRotorArr.find((obj) => obj.rotorObj === newRotorObj).rotorInUse = true;
                break
        }
    }

    const availableRotors = document.querySelectorAll(".available-rotor");
    [...availableRotors].forEach((pEle) => {
        //add event listener for each p elements that was created by createRotorDropDownMenu() function
        pEle.addEventListener("click", (e) => {
            const currentRotorEle = pEle.parentElement.parentElement;
            const selectedRotorObj = globalRotorArr.find((obj) => obj.rotorName === pEle.textContent).rotorObj
            
            switchRotor(currentRotorEle, selectedRotorObj);
            updateCurrentNumberDisplay();
            //update the current number display to the starting number of the new rotor 
            
            //closes the drop down menu
            availableRotorsEle.style.display = "none"
            isDropDownShowing = false;
        })
    })
}

rotorThreeCurrentNumber.addEventListener("click", handleRotorClick)
rotorTwoCurrentNumber.addEventListener("click", handleRotorClick)
rotorOneCurrentNumber.addEventListener("click", handleRotorClick)


let isKeyDown = false;
const handleKeyDown = (e) => {
    if(!isKeyDown) {
        let result;
        if (e.target.tagName === "BODY") {
            result = enigma.encrypt(e.key.toUpperCase());
        } else {
            result = enigma.encrypt(e.target.textContent);
            e.target.classList.add("key-pressed")
        }
    
        //add result to display
        decryptionContainer.textContent += result;
    
        //update rotor display, parseInt then plus one is because .currentNumber is 0 indexed
        rotorOneCurrentNumber.textContent = parseInt(enigma.enigma.rotor1.rotor.currentNumber) + 1;
        rotorTwoCurrentNumber.textContent = parseInt(enigma.enigma.rotor2.rotor.currentNumber) + 1;
        rotorThreeCurrentNumber.textContent = parseInt(enigma.enigma.rotor3.rotor.currentNumber) + 1;
    
        const foundLightElement = [...lights].find((light) => light.textContent === result)
        if (foundLightElement) {
            foundLightElement.classList.add("highlight")
            const keyDownAudio = new Audio("audio/key-down.mp3")
            keyDownAudio.play();
        }

        isKeyDown = true;
    }
}

const handleKeyUp = () => {
    if(isKeyDown) {
        lights.forEach((light) => {
            light.classList.remove("highlight");
        })
        keys.forEach((key) => {
            key.classList.remove("key-pressed");
        })

        const keyUpAudio = new Audio("audio/key-up.mp3")
        keyUpAudio.play();
        
        isKeyDown = false;
    }
}

keys.forEach((key) => {
    key.addEventListener("mousedown", handleKeyDown);
    key.addEventListener("touchstart", (e) => {
        e.preventDefault();
        handleKeyDown(e);
    });
    key.addEventListener("mouseup", handleKeyUp);
    key.addEventListener("touchend", (e) => {
        e.preventDefault();
        handleKeyUp(e);
    });
})

const setRotorCurrentNumber = (rotorId, num) => {
    switch (rotorId) {
        case "rotor1":
            enigma.enigma.rotor1.rotor.currentNumber = num;
            console.log("rotor1 currentNumber is now:", enigma.enigma.rotor1.rotor.currentNumber)
            break
        case "rotor2":
            enigma.enigma.rotor2.rotor.currentNumber = num;
            console.log("rotor2 currentNumber is now:", enigma.enigma.rotor2.rotor.currentNumber)
            break
        case "rotor3":
            enigma.enigma.rotor3.rotor.currentNumber = num;
            console.log("rotor3 currentNumber is now:", enigma.enigma.rotor3.rotor.currentNumber)
            break
    }
}

nextNumberDivs.forEach((nextNumberDiv) => {
    nextNumberDiv.addEventListener("click", (e) => {
        const currentRotor = nextNumberDiv.previousElementSibling;

        if (currentRotor.textContent === "26") {
            currentRotor.textContent = "1";
        } else {
            currentRotor.textContent = parseInt(currentRotor.textContent) + 1;
        }

        setRotorCurrentNumber(currentRotor.id, parseInt(currentRotor.textContent) - 1)
    })
})
previousNumberDivs.forEach((previousNumberDiv) => {
    previousNumberDiv.addEventListener("click", (e) => {
        const currentRotor = previousNumberDiv.previousElementSibling.previousElementSibling;

        if (currentRotor.textContent === "0") {
            currentRotor.textContent = "26";
        } else {
            currentRotor.textContent = parseInt(currentRotor.textContent) - 1;
        }

        setRotorCurrentNumber(currentRotor.id, parseInt(currentRotor.textContent) - 1)
    })
})

document.addEventListener("keydown", (e) => {
    if (!isKeyDown) {
        keys.forEach((key) => {
            if (e.key === key.textContent.toLowerCase() && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                handleKeyDown(e);
                key.classList.add("key-pressed");
            }
        })
    }
})
document.addEventListener("keyup", () => {
    if(isKeyDown) {
        handleKeyUp();
    }
})

//listening for dropping a plug
document.addEventListener("drop", (e) => {
    if (typeof e.target.className !== "string") return

    if (e.target.className.includes("plugged")) {
    //if the target being dropped on, has a class call "plugged"
    //as globalPugArr is updated by MainPlugLogic
    //clear all previous plugs, and set all new plugs to enigma
        enigma.enigma.plugArr = [];
        globalPlugArr.forEach((plugObj) => {
            enigma.setPlug(plugObj);
        })
    };
})

document.addEventListener("mousedown", (e) => {
    //for removing plugs
    if (typeof e.target.className !== "string") return

    if (e.target.className.includes("plugged")) {
        const letter = e.target.textContent;
        const targetPlugObj = globalPlugArr.find((plugObj) => plugObj["firstLetter"] === letter || plugObj["secondLetter"] === letter);
        if (targetPlugObj) {
            enigma.removePlug(targetPlugObj);
        }
    }
})

updateCurrentNumberDisplay();