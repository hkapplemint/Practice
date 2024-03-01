import BuildRotor from "./BuildRotor.js";

class EnigmaBuilder {
    constructor() {
        this.enigma = {};

        this.enigma.reflects = (letter) => {
            const reflectorArr = [
                {"A": "E"},
                {"B": "O"},
                {"C": "A"},
                {"D": "J"},
                {"E": "D"},
                {"F": "Y"},
                {"G": "B"},
                {"H": "W"},
                {"I": "S"},
                {"J": "Z"},
                {"K": "F"},
                {"L": "K"},
                {"M": "G"},
                {"N": "I"},
                {"O": "U"},
                {"P": "Q"},
                {"Q": "V"},
                {"R": "P"},
                {"S": "L"},
                {"T": "C"},
                {"U": "T"},
                {"V": "X"},
                {"W": "M"},
                {"X": "H"},
                {"Y": "R"},
                {"Z": "N"}
            ]
            reflectorArr.find((obj) => {
                //an obj looks like {"B": "R"}
                //by passing letter directly as a key, it will return the corresponding value
                if (obj[letter]) {
                    return obj[letter]
                }
            })
        }

        this.enigma.encrypt = (letter) => {
            let currentLetter = letter;
    
            //the letter first go through a plug board
            currentLetter = this.enigma.plugArr.find((plugObj) => {
                if (plugObj[1] === currentLetter) {
                    //if there is a plugObj with its "1" value equal to 
                    //the current character, return the corresponding "2" 
                    //value and bind it to the current character
                    return plugObj[2];
                } else {
                    //if not found, i.e. no plugObj for this character, 
                    //just simply return the original current character
                    return currentLetter;
                }
            })

            //the letter go through right rotor
            currentLetter = this.enigma.rotor1.inToOut(currentLetter);
            this.enigma.rotor1.rotate();
            if(this.enigma.rotor1.currentNumber === this.enigma.rotor2.ringNotch) {
                this.enigma.rotor2.rotate();
            }
            
            currentLetter = this.enigma.rotor2.inToOut(currentLetter);
            this.enigma.rotor2.rotate()
            if(this.enigma.rotor2.currentNumber === this.enigma.rotor3.ringNotch) {
                this.enigma.rotor3.rotate();
            }

            currentLetter = this.enigma.rotor3.inToOut(currentLetter);

            currentLetter = this.enigma.reflects(currentLetter);

            currentLetter = this.enigma.rotor3.outToIn(currentLetter);

            currentLetter = this.enigma.rotor2.outToIn(currentLetter);

            currentLetter = this.enigma.rotor1.outToIn(currentLetter);

            currentLetter = this.enigma.plugArr.find((plugObj) => {
                if (plugObj[2] === currentLetter) {
                    return plugObj[1];
                } else {
                    return currentLetter;
                }
            })
        };
    }

    setRotor1(rotorObj) {
        //  transform an incoming character to a different character
        //  transform an outgoing character to a different character
        // rotate, uses the next item in the rotorObj array
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
        //example of a plugObj {"1": G, "2": K}
        this.enigma.plugArr.push(plugObj);
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