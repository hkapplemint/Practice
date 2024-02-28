const digitBtns = document.querySelectorAll(".digit");
const display = document.querySelector(".display");
const moreFunctions = document.getElementById("more-functions");
const allClearBtn = document.getElementById("AC-btn");
const deleteBtn = document.getElementById("delete-btn");
const showMoreBtn = document.getElementById("show-more-btn");
const showMoreRelateds = document.querySelectorAll(".show-more-related");
const equalBtn = document.getElementById("equal-btn");
const dotBtn = document.getElementById("dot-btn");
const multiplyBtn = document.getElementById("multiply-btn");
const divideBtn = document.getElementById("divide-btn");
const plusBtn = document.getElementById("plus-btn");
const minusBtn = document.getElementById("minus-btn");
const displayResult = document.getElementById("display-result");
const displayShowMoreBtn = document.getElementById("display-show-more");
const history = document.getElementById("history");

const regexOperators = /[x÷\*\/\+\-]/;
let calculated = false;

const regexValidFormula = /(-?\d+\.?\d*)([\+\-x÷\/\*])(-?\d+\.?\d*)/;

digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {

        if(calculated) {
            display.value = ""
            calculated = false;
        }

        display.value += e.currentTarget.textContent;
        if(display.value.match(regexValidFormula)){
            calculate(display.value);
        }
    })
})

document.addEventListener("keydown", (e) => {
    if (e.target.tagName !== "INPUT") {
        if (e.key.match(/[0-9\.]/) && e.key.length === 1) {
            if(calculated) {
                display.value = ""
                calculated = false;
            }
    
            display.value += e.key;
            if(display.value.match(regexValidFormula)){
                calculate(display.value);
            }
        }
    }
})

display.addEventListener("input", (e) => {
    if(display.value.match(regexValidFormula)){
        calculate(display.value);
    }
})

displayShowMoreBtn.addEventListener("click", () => {
    const svg = displayShowMoreBtn.querySelector("svg");
    svg.classList.toggle("display-show-more-expanded");
    history.classList.toggle("history-expand")
})

plusBtn.addEventListener("click", replaceLastOperator);
multiplyBtn.addEventListener("click", replaceLastOperator);
divideBtn.addEventListener("click", replaceLastOperator);
minusBtn.addEventListener("click", (e) => {
    calculated = false;
    if (display.value.at(-1).match(/[\+\-]/)) {
        display.value = display.value.slice(0, -1);
        display.value += e.currentTarget.textContent;
    } else {
        display.value += e.currentTarget.textContent;
    }
})

function replaceLastOperator(e) {
    calculated = false;
    if (display.value.at(-1).match(regexOperators)) {
        display.value = display.value.slice(0, -1);
        display.value += e.currentTarget.textContent;
    } else {
        display.value += e.currentTarget.textContent;
    }
}

document.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.target.tagName !== "INPUT") {
        if (e.key.match(/[\+\*\/]/)) { //for plus, multiply, divide;
            if (display.value.at(-1).match(regexOperators)) {
                display.value = display.value.slice(0, -1);
                display.value += e.key;
            } else {
                display.value += e.key;
            }
        }
        if (e.key.match(/[\-]/)) { //for minus
            if (display.value.at(-1).match(/[\+\-]/)) {
                display.value = display.value.slice(0, -1);
                display.value += e.key;
            } else {
                display.value += e.key;
            }
        }
        calculated = false;
    }
})

allClearBtn.addEventListener("click", () => {
    display.value = "";
    displayResult.textContent = "";
    display.disabled = false;
    calculated = false;
})

deleteBtn.addEventListener("click", () => {
    if(display.value.length > 0) {
        display.value = display.value.slice(0, -1);
        if(display.value.match(regexValidFormula)){
            calculate(display.value);
        }
    }
})
document.addEventListener("keydown", (e) => {
    if (e.target.tagName !== "INPUT") {
        if (e.key === "Backspace") {
            if(display.value.length > 0) {
                display.value = display.value.slice(0, -1);
                if(display.value.match(regexValidFormula)){
                    calculate(display.value);
                }
            }
        }
    }
})

let isShowingMore = false;
let animationInProgress = false;
showMoreBtn.addEventListener("click", () => {
    const showMoreSvg = showMoreBtn.querySelector("svg");
    if(!isShowingMore) {
        const animation = showMoreSvg.animate(
            { transform: "rotate(-180deg"},
            { duration: 200, fill: "forwards" }
        );

        animationInProgress = true;

        animation.finished.then(()=>{
            animationInProgress = false;
            isShowingMore = true;
        });
    } else {
        const animation = showMoreSvg.animate(
            { transform: "rotate(0deg"},
            { duration: 200, fill: "forwards" }
        );
        
        animationInProgress = true;

        animation.finished.then(()=>{
            animationInProgress = false;
            isShowingMore = false;
        })
    }

    isShowingMore = !isShowingMore;

    moreFunctions.classList.toggle("more-functions-expand");
    showMoreRelateds.forEach(element => {
        element.classList.toggle("hidden");
    })
})



function toFixedAndParseFloat(string) {
    return parseFloat(parseFloat(string).toFixed(7))
}

function switchFourOperators(firstNumber, infix, secondNumber) {
    let result;
    switch(infix) {
        case "*":
            case "x":
                result = toFixedAndParseFloat(firstNumber * secondNumber)
                break
        case "÷":
        case "/":
            result = toFixedAndParseFloat(firstNumber / secondNumber)
            break
        case "+":
            result = toFixedAndParseFloat(firstNumber + secondNumber)
            break
        case "-":
            result = toFixedAndParseFloat(firstNumber - secondNumber)
            break
        default:
            result = NaN;
            break
        }
    return result;
}
const regexNumbers = /[\d]+[.]?[\d]*/g;
const regexParen = /\(-?\d+.?\d?\)/;
const regexExtractFormulaHighInfix = /(-?\d+\.?\d*)([x÷\/\*])(-?\d+\.?\d*)/;
const regexExtractFormulaLowInfix = /(-?\d+\.?\d*)([\+\-])(-?\d+\.?\d*)/;

function calculate(inputString) {

    let leftMostParen = inputString.match(regexParen);
    if(leftMostParen) {
        console.log(`Left Most Paren Exist: ${leftMostParen}`)
        let formula = regexExtractFormulaHighInfix.exec(leftMostParen[0]);
        if (formula !== null) {
            console.log(`Paren formula: ${formula}`)
            let firstNumber = toFixedAndParseFloat(formula[1]);
            let infix = formula[2];
            let secondNumber = toFixedAndParseFloat(formula[3]);
    
            let result = switchFourOperators(firstNumber, infix, secondNumber)
    
            inputString = inputString.replace(leftMostParen[0], result);
            calculate(inputString);
        } else {
            formula = regexExtractFormulaLowInfix.exec(leftMostParen[0]);
            console.log(`Paren formula: ${formula}`)
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber)
            inputString = inputString.replace(leftMostParen[0], result);
            calculate(inputString);
        }
        
    } else {
        console.log("Left most paren not exist")
        let leftMostFormula = inputString.match(regexExtractFormulaHighInfix);
        if(leftMostFormula){
            formula = regexExtractFormulaHighInfix.exec(leftMostFormula);
            console.log(`Not paren formula: ${formula}`);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
            
            result = switchFourOperators(firstNumber, infix, secondNumber);
            inputString = inputString.replace(leftMostFormula[0], result);
            calculate(inputString);
        } else {
            leftMostFormula = inputString.match(regexExtractFormulaLowInfix);

            if(!leftMostFormula) {
                console.log("Final answer: ", inputString)
                const isNumberCheck = inputString.match(/-?\d+\.?\d*/);
                displayResult.textContent = isNumberCheck[0] === inputString
                    ? inputString
                    : "";
                    // : "Syntax Error";
                return
            }

            formula = regexExtractFormulaLowInfix.exec(leftMostFormula);
            console.log(`Not paren formula: ${formula}`);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber);
            inputString = inputString.replace(leftMostFormula[0], result);
    
            calculate(inputString);
        }
    }
}

function addToHistory() {
    const formula = display.value;
    const answer = displayResult.textContent;

    if(!answer.match(/-?\d+\.?\d*/)) return

    const objHTML = document.createElement("div");
    objHTML.classList.add("previousCal");
    objHTML.innerHTML = `
    <p class="formula">${formula}</p>
    <p class="answer">= <span>${answer}</span></p>
    `
    history.append(objHTML);
}

equalBtn.addEventListener("click", () => {
    handleEqualBtn()
})

function handleEqualBtn() {
    addToHistory();
    display.value = calculate(display.value);
    if(displayResult.textContent !== "") {
        cleanZeros(display.value);
        display.value = displayResult.textContent;
        displayResult.textContent = "";
    }
    calculated = true;
};
function cleanZeros(string) {
    const regexCleaningZero = /-?(0+)[1-9]+\.?\d*/;
    const match = regexCleaningZero.exec(string);
    if (match) {
        string = string.replace(match[1], "");
        console.log("cleaned: ",string);
    }
    return string
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleEqualBtn();
    }
})