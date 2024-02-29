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
const displayShowMoreHorizontalBtn = document.getElementById("display-show-more-horizontal")
const history = document.getElementById("history");
const percentBtn = document.getElementById("percent-btn");
const parenBtn = document.getElementById("paren-btn");
const sinBtn = document.getElementById("sin-btn");
const cosBtn = document.getElementById("cos-btn");
const tanBtn = document.getElementById("tan-btn");
const eBtn = document.getElementById("e-btn");
const lnBtn = document.getElementById("ln-btn");
const logBtn = document.getElementById("log-btn");
const sqRootBtn = document.getElementById("sq-root-btn");
const piBtn = document.getElementById("pi-btn");
const powerBtn = document.getElementById("power-btn");
const factorialBtn = document.getElementById("factorial-btn");
const fxBeforeBtns = document.querySelectorAll(".fx-before");

const regexOperators = /[x÷\*\/\+\-]/;
let calculated = false;

let numberOfOpenParen = 0;
let numberOfCloseParen = 0;

const regexValidFormula = /(-?\d+\.?\d*)([\+\-x÷\/\*])(-?\d+\.?\d*)/;

digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {

        if(calculated) {
            display.value = ""
            calculated = false;
        }

        display.value += e.currentTarget.textContent;
        
        calculate(display.value)
        if(display.value === displayResult.textContent) {
            displayResult.textContent = "";
        }
    })
})

document.addEventListener("keydown", (e) => {
    if (e.target.tagName !== "INPUT") {
        if (e.key.match(/[0-9]/) && e.key.length === 1) {
            if(calculated) {
                display.value = ""
                calculated = false;
            }
    
            display.value += e.key;
            calculate(display.value)
            if(display.value === displayResult.textContent) {
                displayResult.textContent = "";
            }
        }
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
        if (e.key === ".") { //for dot
            handleDotBtn();
        }
        calculated = false;
    }   
    if (e.key === "Tab" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
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
    history.classList.toggle("history-expand");
})
displayShowMoreHorizontalBtn.addEventListener("click", () => {
    const svg = displayShowMoreHorizontalBtn.querySelector("svg");
    svg.classList.toggle("display-show-more-expanded");
    history.classList.toggle("history-expand");
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
    // showMoreRelateds.forEach(element => {
    //     element.classList.toggle("hidden");
    // })
})



function toFixedAndParseFloat(string) {
    return parseFloat(parseFloat(string).toFixed(20))
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
const regexFxBefore = /([√]|(?![x])[a-zA-Z]+)(-?\d+\.?\d*)/;
const regexFxAfter = /(-?\d+\.?\d*)([π!%e])/;
const regexFxBetween = /(-?\d+\.?\d*)([\^])(-?\d+\.?\d*)/;
const regexSingleNumberInParen = /\((-?\d+\.?\d*)\)/;

function calculate(inputString) {
    console.log("Starting a new round of calculation:", inputString)

    numberOfOpenParen = 0;
    numberOfCloseParen = 0;

    inputString = removeParenOfSingleNumber(inputString);


    let leftMostParen = inputString.match(regexParen);
    if(leftMostParen) {
        console.log(`Left Most Paren Exist: ${leftMostParen}`)
        let formula = regexExtractFormulaHighInfix.exec(leftMostParen[0]);
        if (regexFxAfter.exec(inputString) || regexFxBefore.exec(inputString) || regexFxBetween.exec(inputString)) {
            if (regexFxBetween.exec(inputString)) {
                handleMoreFxBetween(inputString);
                return
            } else if (regexFxAfter.exec(inputString)) {
                handleMoreFxAfter(inputString);
                return
            } else if (regexFxBefore.exec(inputString)) {
                handleMoreFxBefore(inputString);
                return
            }
        } else if (formula !== null) {
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
        if (regexFxAfter.exec(inputString) || regexFxBefore.exec(inputString) || regexFxBetween.exec(inputString)) {
            if (regexFxBetween.exec(inputString)) {
                handleMoreFxBetween(inputString);
                return
            } else if (regexFxAfter.exec(inputString)) {
                handleMoreFxAfter(inputString);
                return
            } else if (regexFxBefore.exec(inputString)) {
                handleMoreFxBefore(inputString);
                return
            }
        } else if(leftMostFormula){
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
                const isNumberCheck = inputString.match(/-?\d+\.?\d*(?:e\+)?\d*/);
                if (isNumberCheck) {
                    console.log("Number made into displaying section")
                    displayResult.textContent = isNumberCheck[0] === inputString
                        ? inputString
                        : "";
                    return
                } else if (inputString === "Infinity") {
                    displayResult.textContent = "Infinity";
                    return
                } else if (inputString === "-Infinity") {
                    displayResult.textContent = "-Infinity";
                    return
                }
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

function handleMoreFxBetween(inputString) {
    formula = regexFxBetween.exec(inputString);
    firstNumber = toFixedAndParseFloat(formula[1]);
    infix = formula[2];
    secondNumber= toFixedAndParseFloat(formula[3]);

    result = moreFunctionsBetween(firstNumber, infix, secondNumber);
    inputString = inputString.replace(formula[0], result);
    calculate(inputString);
}
function handleMoreFxAfter(inputString) {
    formula = regexFxAfter.exec(inputString);
    firstNumber = toFixedAndParseFloat(formula[1]);
    suffix = formula[2];

    result = moreFunctionsAfter(firstNumber, suffix);
    inputString = inputString.replace(formula[0], result);
    calculate(inputString);
}
function handleMoreFxBefore(inputString) {
    formula = regexFxBefore.exec(inputString);
    prefix = formula[1].startsWith("x")
        ? formula[1].slice(1)
        : formula[1];
    firstNumber = toFixedAndParseFloat(formula[2]);

    result = moreFunctionsBefore(prefix, firstNumber);
    inputString = inputString.replace(formula[0], result);
    console.log(
        "formula[0]:", formula[0],
        "handleMoreFxBefore Output:", inputString
        )
    calculate(inputString);
}

function moreFunctionsAfter(firstNumber, suffix) {
    switch (suffix) {
        case "!":
            return toFixedAndParseFloat(factorialOf(firstNumber));
        case "π":
            return toFixedAndParseFloat(firstNumber * Math.PI);
        case "%":
            return toFixedAndParseFloat(firstNumber / 100);
        case "e":
            return toFixedAndParseFloat(firstNumber * Math.E)
    }
}
function moreFunctionsBefore(prefix, firstNumber) {
    switch (prefix) {
        case "√":
            return toFixedAndParseFloat(Math.sqrt(firstNumber));
        case "sin":
            return toFixedAndParseFloat(Math.sin(firstNumber));
        case "cos":
            return toFixedAndParseFloat(Math.cos(firstNumber));
        case "tan":
            return toFixedAndParseFloat(Math.tan(firstNumber));
        case "log":
            return toFixedAndParseFloat(Math.log10(firstNumber));
        case "ln":
            return toFixedAndParseFloat(Math.log(firstNumber));

    }
}

function factorialOf(number) {
    if (number === 0 || number === 1){
        return 1;
    }
    return number * factorialOf(number - 1);
}

function moreFunctionsBetween(firstNumber, infix, secondNumber) {
    switch (infix) {
        case "^":
            return toFixedAndParseFloat(Math.pow(firstNumber, secondNumber));
    }
}

function removeParenOfSingleNumber(inputString) {
    const match = regexSingleNumberInParen.exec(inputString);
    if (match) {
        return inputString.replace(match[0], match[1]);
    } else {
        return inputString;
    }
}

function addToHistory() {
    let formula = display.value;
    const answer = displayResult.textContent;

    if(!answer.match(/-?\d+\.?\d*/)) return

    formula = cleanZeros(formula);

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
    calculate(display.value);
    if(displayResult.textContent !== "") {
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
    }
    return string
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleEqualBtn();
    }
})

function handleDotBtn() {
    const regexDot = /-?\d+\.?\d*[x÷\*\/\+\-]?/g;
    const matchesArr = display.value.match(regexDot);
    const lastValue = matchesArr[matchesArr.length-1];
    console.log("matchesArr: ", matchesArr, "lastValue: ", lastValue);
    if(!lastValue.includes(".") && matchesArr){
        console.log("lastValue does not have a dot")
        display.value += ".";
    }
}

dotBtn.addEventListener("click", () => {
    handleDotBtn();
})




fxBeforeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        display.value += `${btn.textContent}(`
    })
})
eBtn.addEventListener("click", () => {
    display.value += eBtn.textContent;
    calculate(display.value);
})

piBtn.addEventListener("click", e => {
    display.value += piBtn.textContent;
    calculate(display.value)
})

powerBtn.addEventListener("click", e => {
    display.value += powerBtn.textContent;
})

factorialBtn.addEventListener("click", e => {
    display.value += factorialBtn.textContent;
    calculate(display.value)
})



parenBtn.addEventListener("click", e => {
    const openParenMatches = display.value.match(/\(/g);
    if(openParenMatches) {
        numberOfOpenParen = openParenMatches.length;
        console.log(numberOfOpenParen);
    }
    
    if (display.value) {
        if (display.value.at(-1).match(/\(/) || display.value.at(-1).match(regexOperators)) {
            display.value += "(";
        } else if (numberOfOpenParen > 0) {
            const closeParenMatches = display.value.match(/\)/g)
            if(closeParenMatches) {
                numberOfCloseParen = closeParenMatches.length;
            }
            if(numberOfOpenParen > numberOfCloseParen){
                display.value += ")";
            }
        }
    } else {
        display.value += "("
    }

    calculate(display.value);
    if(display.value === displayResult.textContent) {
        displayResult.textContent = "";
    }
})

percentBtn.addEventListener("click", e => {
    if (display.value) {
        const match = display.value.at(-1).match(/\d/)
        if (match) {
            display.value += "%";
        }
    }

    calculate(display.value);
})