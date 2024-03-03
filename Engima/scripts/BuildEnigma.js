import BuildRotor from "./BuildRotor.js";

export default class EnigmaBuilder {
    constructor() {
        this.enigma = {};

        this.enigma.plugArr = [];

    }

    reflects(letter) {
        const reflectorArr = [
            {"A": "E"},
            {"B": "O"},
            {"C": "T"},
            {"D": "J"},
            {"E": "A"},
            {"F": "Y"},
            {"G": "M"},
            {"H": "W"},
            {"I": "S"},
            {"J": "D"},
            {"K": "X"},
            {"L": "U"},
            {"M": "G"},
            {"N": "Z"},
            {"O": "B"},
            {"P": "R"},
            {"Q": "V"},
            {"R": "P"},
            {"S": "I"},
            {"T": "C"},
            {"U": "L"},
            {"V": "Q"},
            {"W": "H"},
            {"X": "K"},
            {"Y": "F"},
            {"Z": "N"}
        ]

        const foundObj = reflectorArr.find((obj) => {
            //an obj looks like {"B": "R"}
            //by passing letter directly as a key, it will return the corresponding value
            if (obj[letter]) {
                console.log(`Reflector, ${letter} is reflected to be ${obj[letter]}`)
                return obj[letter];
            }
        })
        const letterToReturn = Object.values(foundObj)[0];

        return letterToReturn;
    }
    
    encrypt(letter) {
        let currentLetter = letter;

        console.log("Enigma starting to encrypt letter", currentLetter)

        //the letter first go through a plug board
        this.enigma.plugArr.find((plugObj) => {
            if (plugObj["firstLetter"] === currentLetter) {
                //if there is a plugObj with its "firstLetter" value equal to 
                //the current character, return the corresponding "secondLetter" 
                //value and bind it to the current character
                console.log(`First time going through plug, ${currentLetter} changed to ${plugObj["secondLetter"]}`)
                currentLetter = plugObj["secondLetter"];
            } else if (plugObj["secondLetter"] === currentLetter) {
                currentLetter = plugObj["firstLetter"];
            }
        })

        //the letter go through right rotor
        this.enigma.rotor1.rotate();

        console.log(`Rotor 1 current number ${this.enigma.rotor1.rotor.currentNumber}, Rotor 2 ring notch ${this.enigma.rotor2.rotor.ringNotch}`)
        
        if(this.enigma.rotor1.rotor.currentNumber === this.enigma.rotor2.rotor.ringNotch) {
            console.log(`Rotor 1 caused Rotor 2 to rotate`)
            this.enigma.rotor2.rotate();

            console.log(`Rotor 2 current number ${this.enigma.rotor2.rotor.currentNumber}, Rotor 3 ring notch ${this.enigma.rotor3.rotor.ringNotch}`)

            if(this.enigma.rotor2.rotor.currentNumber === this.enigma.rotor3.rotor.ringNotch) {
                console.log(`Rotor 2 caused Rotor 3 to rotate`)
                this.enigma.rotor3.rotate();
            }
        }

        currentLetter = this.enigma.rotor1.inToOut(currentLetter);
        
        currentLetter = this.enigma.rotor2.inToOut(currentLetter);

        currentLetter = this.enigma.rotor3.inToOut(currentLetter);

        currentLetter = this.reflects(currentLetter);

        currentLetter = this.enigma.rotor3.outToIn(currentLetter);

        currentLetter = this.enigma.rotor2.outToIn(currentLetter);

        currentLetter = this.enigma.rotor1.outToIn(currentLetter);

        this.enigma.plugArr.find((plugObj) => {
            if (plugObj["firstLetter"] === currentLetter) {
                console.log(`Second time going through plug, ${currentLetter} changed to ${plugObj["secondLetter"]}`)
                currentLetter =  plugObj["secondLetter"];
            } else if (plugObj["secondLetter"] === currentLetter) {
                console.log(`Second time going through plug, ${currentLetter} changed to ${plugObj["firstLetter"]}`)
                currentLetter =  plugObj["firstLetter"];
            }
        });

        return currentLetter; //return final answer;
    };

    setRotor1(rotorObj) {
        this.enigma.rotor1 = rotorObj;
        return this;
    }
    setRotor2(rotorObj) {
        this.enigma.rotor2 = rotorObj;
        return this;
    }
    setRotor3(rotorObj) {
        this.enigma.rotor3 = rotorObj;
        return this;
    }

    setPlug(plugObj) {
        //push a new plug object into the plug array of enigma
        //example of a plugObj {"firstLetter": G, "secondLetter": K}
        this.enigma.plugArr.push(plugObj);
        return this;
    }

    removePlug(plugObj) {
        //look for the plugObj's index in the enigma.plugArr
        const targetPlugIndex = this.enigma.plugArr.indexOf(plugObj);
        if (targetPlugIndex >= 0) {
            this.enigma.plugArr.splice(targetPlugIndex, 1);
        }
        return this;
    }

    build() {
        if (this.enigma.rotor1 && this.enigma.rotor2 && this.enigma.rotor3) {
            //check if all 3 rotors present
            return this.enigma
        } else {
            console.error("Not all 3 rotors are set! Unable to build an enigma")
        }
    }
}