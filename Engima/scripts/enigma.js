
class EnigmaBuilder {
    constructor() {
        this.enigma = {};

        this.enigma.encrypt = (letter) => {
            let currentLetter = letter;
    
            //the character first go through a plug board
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

        };
    }

    setRotor1(rotorObj) {
        //rotorObj has an array, containing a pre-defined internal randomization for 13 pairs of numbers
        //  example [{in: 10, out: 21}, {in: 11, out: 4}, {in: 12, out: 3}]
        //rotorObj has 3 functions
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