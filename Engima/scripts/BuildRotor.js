export default class RotorBuilder {
    constructor() {
        this.rotor = {}
        this.rotor.currentNumber = 0;
    }

    rotate() {
        this.rotor.currentNumber++;

        if(this.rotor.currentNumber === this.rotor.scrambleArr.length) {
            //rotor rotated a whole round, hence need to loop from the beginning
            this.rotor.currentNumber = 0;
        }
    };

    inToOut(letter) {
        //char code "a" is 65, "z" is 90
        let newLetterCharCode = letter.charCodeAt(0) + this.rotor.scrambleArr[this.rotor.currentNumber] //result a number
        // console.log("InToOut offset:", this.rotor.scrambleArr[this.rotor.currentNumber])

        if (newLetterCharCode > 90) {
            newLetterCharCode = newLetterCharCode - 26;
        } else if (newLetterCharCode < 65) {
            newLetterCharCode = newLetterCharCode + 26;
        }

        console.log(`Rotor In to Out, ${letter} changed to ${String.fromCharCode(newLetterCharCode)}`)
        return letter = String.fromCharCode(newLetterCharCode)
    }

    outToIn(letter) {
        let newLetterCharCode = letter.charCodeAt(0) - this.rotor.scrambleArr[this.rotor.currentNumber] //changes from + to -

        // console.log("InToOut offset:", -this.rotor.scrambleArr[this.rotor.currentNumber])

        if (newLetterCharCode > 90) {
            newLetterCharCode = newLetterCharCode - 26;
        } else if (newLetterCharCode < 65) {
            newLetterCharCode = newLetterCharCode + 26;
        }

        console.log(`Rotor Out to In, ${letter} changed to ${String.fromCharCode(newLetterCharCode)}`)
        return letter = String.fromCharCode(newLetterCharCode)
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

    setStartingNumber(num) {
        if (num < 0 || num > 25) {
            console.error("Ring notch must be between 0 and 25")
            return
        }

        this.rotor.currentNumber = num;
        return this;
    }

    setName(string) {
        this.rotor.name = string;
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