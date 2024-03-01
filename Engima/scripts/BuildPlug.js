export default class PlugBuilder {
    constructor() {
        this.plug = {};
    }

    setFirstLetter(letter) {
        this.plug.firstLetter = letter;
        return this
    }
    setSecondLetter(letter) {
        this.plug.secondLetter = letter;
        return this
    }

    build() {
        return this.plug;
    }
}