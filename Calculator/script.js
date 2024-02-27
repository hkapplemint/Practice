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

const regexOperators = /[x÷\+\-]/;
let calculated = false;

digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {
        if(calculated) {
            display.value = ""
            calculated = false;
        }

        display.value += e.currentTarget.textContent;
        if(display.value.match(regexOperators)){
            calculate(display.value);
        }
    })
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
    if (display.value.at(-1).match(/[\+\-]/)) {
        display.value = display.value.slice(0, -1);
        display.value += e.currentTarget.textContent;
    } else {
        display.value += e.currentTarget.textContent;
    }
})
function replaceLastOperator(e) {
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
                const isNumberCheck = inputString.match(/-?\d*\.?\d*/);
                displayResult.textContent = isNumberCheck[0] === inputString
                    ? inputString
                    : "Syntax Error";
                if (displayResult.textContent === "Syntax Error") {
                    display.disabled = true;
                }
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
    const objHTML = document.createElement("div");
    objHTML.classList.add("previousCal");
    objHTML.innerHTML = `
    <p class="formula">${formula}</p>
    <p class="answer">=${answer}</p>
    `

    history.append(objHTML);
}

equalBtn.addEventListener("click", () => {
    addToHistory();

    calculate(display.value);
    display.value = displayResult.textContent;
    displayResult.textContent = "";

    calculated = true;

})

display.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addToHistory();

        calculate(display.value);
        previousCalculations.push([display.value, displayResult.textContent]);
        display.value = displayResult.textContent;
        displayResult.textContent = "";

        calculated = true;
    }
})