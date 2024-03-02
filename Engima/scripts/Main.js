import RotorBuilder from "./BuildRotor.js";
import EnigmaBuilder from "./BuildEnigma.js";
import PlugBuilder from "./BuildPlug.js";
import {globalPlugArr} from "./MainPlugLogic.js"

const scrambleArr1 = [11, 24, 16, -2, 15, 16, 2, -5, 6, 4, -6, 11, 12, 10, -7, -15, 1, -12, -9, -9, -5, -5, -16, -11, -21, -5];
const scrambleArr2 = [16, 8, 7, 10, 11, 6, 2, 4, 22, 0, 19, 21, 1, 24, 18, 14, 17, 9, 3, 25, 23, 15, 13, 20, 12, 5];
const scrambleArr3 = [24, 21, 21, -1, 17, 13, -6, -1, 17, 10, -6, 6, 1, -12, 6, -3, -2, -14, -11, -10, -12, -11, -6, -12, -19, -10];

const ringNotch1 = 1;
const ringNotch2 = 13;
const ringNotch3 = 7;

const plug1 = new PlugBuilder()
    .setFirstLetter("E")
    .setSecondLetter("J")
    .build();

const plug2 = new PlugBuilder()
    .setFirstLetter("H")
    .setSecondLetter("K")
    .build();

const rotor1 = new RotorBuilder()
    .setScrambleArr(scrambleArr1)
    .setRingNotch(ringNotch1)
    .setStartingNumber(24);
const rotor2 = new RotorBuilder()
    .setScrambleArr(scrambleArr2)
    .setRingNotch(ringNotch2)
    .setStartingNumber(6);
const rotor3 = new RotorBuilder()
    .setScrambleArr(scrambleArr3)
    .setRingNotch(ringNotch3)
    .setStartingNumber(4);

const enigma = new EnigmaBuilder()
    .setRotor1(rotor1)
    .setRotor2(rotor2)
    .setRotor3(rotor3)
    .setPlug(plug1)
    .setPlug(plug2)









const keys = document.querySelectorAll(".key");
const lights = document.querySelectorAll(".light");
const decryptionContainer = document.querySelector(".decryption-container");
const rotorOne = document.getElementById("rotor1");
const rotorTwo = document.getElementById("rotor2");
const rotorThree = document.getElementById("rotor3");

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
    
        //update rotor display
        rotorOne.textContent = enigma.enigma.rotor1.rotor.currentNumber;
        rotorTwo.textContent = enigma.enigma.rotor2.rotor.currentNumber;
        rotorThree.textContent = enigma.enigma.rotor3.rotor.currentNumber;
    
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

document.addEventListener("mousedown", () => {
    console.log(globalPlugArr);
})