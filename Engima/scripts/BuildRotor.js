export default class BuildRotor {
    constructor() {
        this.rotor = {}
        this.rotor.currentNumber = 0;

        this.rotor.rotate = () => {
            this.rotor.currentNumber++;

            if(this.rotor.currentNumber === this.rotor.scrambleArr.letter - 1) {
                //rotor rotated a whole round, hence need to loop from the beginning
                this.rotor.currentNumber = 0;
            }
        };

        this.rotor.inToOut = (letter) => {
            //char code "a" is 65, "z" is 90
            let newLetterCharCode = letter.charCodeAt(0) + this.rotor.scrambleArr[currentNumber] //result a number

            if (newLetterCharCode > 90) {
                newLetterCharCode = newLetterCharCode - 26;
                return letter = String.fromCharCode(newLetterCharCode);
            } else if (newLetterCharCode < 65) {
                newLetterCharCode = newLetterCharCode + 26;
                return letter = String.fromCharCode(newLetterCharCode)
            } else {
                return letter;
            }
        }

        this.rotor.outToIn = (letter) => {
            let newLetterCharCode = letter.charCodeAt(0) - this.rotor.scrambleArr[currentNumber] //changes from + to -

            if (newLetterCharCode > 90) {
                newLetterCharCode = newLetterCharCode - 26;
                return letter = String.fromCharCode(newLetterCharCode);
            } else if (newLetterCharCode < 65) {
                newLetterCharCode = newLetterCharCode + 26;
                return letter = String.fromCharCode(newLetterCharCode)
            } else {
                return letter;
            }
        }
    }

    setScrambleArr(arr) {
        this.rotor.scrambleArr = arr;
        return this;
    }

    setRingNotch(num) {
        if (num < 0 || num > 25) {
            console.error("Ring notch must be between 0 and 25")
            return
        }

        this.rotor.ringNotch = num;
        return this;
    }

    build() {
        if(this.rotor.scrambleArr) {
            return this.rotor;
        } else {
            console.error("Failed to build a rotor. Must add a predefined scramble array using .addScrambleArr(arr) method")
        }
    }
}