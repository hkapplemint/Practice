const digitBtns = document.querySelectorAll(".digit");
const display = document.querySelector(".display");
const allClearBtn = document.getElementById("AC-btn");
const deleteBtn = document.getElementById("delete-btn");
const showMoreBtn = document.getElementById("show-more-btn");
const showMoreRelateds = document.querySelectorAll(".show-more-related");
const equalBtn = document.getElementById("equal-btn");
const dotBtn = document.getElementById("dot-btn");
const operators = document.querySelectorAll(".operator");

digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {
        display.value += e.currentTarget.textContent;
    })
})
operators.forEach(operatorBtn => {
    operatorBtn.addEventListener("click", (e) => {
        display.value += e.currentTarget.textContent;
    })
})

allClearBtn.addEventListener("click", () => {
    display.value = "";
})

deleteBtn.addEventListener("click", () => {
    if(display.value.length > 0) {
        display.value = display.value.slice(0, -1);
    }
})

showMoreBtn.addEventListener("click", () => {
    showMoreRelateds.forEach(element => {
        element.classList.toggle("hidden");
    })
})


const regexNumbers = /[\d]+[.]?[\d]*/g;
const regexParen = /\([^()]+\)/g;
const regexExtractFormulaHighInfix = /(-?\d+\.?\d*)([x÷])(-?\d+\.?\d*)/;
const regexExtractFormulaLowInfix = /(-?\d+\.?\d*)([\+\-])(-?\d+\.?\d*)/;

// const str = "(12.66/-23)";
// console.log(regexHighOrderInfix.exec(str)[1]);

function toFixedAndParseFloat(string) {
    return parseFloat(parseFloat(string).toFixed(10))
}

function switchFourOperators(firstNumber, infix, secondNumber) {
    let result;
    switch(infix) {
        case "x":
            result = toFixedAndParseFloat(firstNumber * secondNumber)
            break
        case "÷":
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

function calculate(inputString) {
    //const inputString = display.value;
    //e.g. 230+(12.66*-23)-(32.1-34.1)
    const parenMatches = inputString.match(regexParen);
    //parenMatches = ["(12.66*-23)", "(32.1-34.1)"]
    if(parenMatches) {
        let leftMostParen = parenMatches.shift();
        let formula = regexExtractFormulaHighInfix.exec(leftMostParen);
        if (formula) {
            let firstNumber = toFixedAndParseFloat(formula[1]);
            let infix = formula[2];
            let secondNumber = toFixedAndParseFloat(formula[3]);
    
            let result = switchFourOperators(firstNumber, infix, secondNumber)
    
            inputString = inputString.replace(leftMostParen, result);
            calculate(inputString);
        } else {
            formula = regexExtractFormulaLowInfix.exec(leftMostParen);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber)
    
            inputString = inputString.replace(leftMostParen, result);
            calculate(inputString);
        }

    } else {
        let leftMostFormula = inputString.match(regexExtractFormulaHighInfix);
        if(leftMostFormula){
            formula = regexExtractFormulaHighInfix.exec(leftMostFormula);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber);
            inputString = inputString.replace(leftMostFormula[0], result);
    
            calculate(inputString);
        } else {
            leftMostFormula = inputString.match(regexExtractFormulaLowInfix);
            if(!leftMostFormula) {
                console.log(inputString);
                display.value = inputString;
                return;
            }
            formula = regexExtractFormulaLowInfix.exec(leftMostFormula);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber);
            inputString = inputString.replace(leftMostFormula[0], result);
    
            calculate(inputString);
        }
    }
}

equalBtn.addEventListener("click", () => {
    calculate(display.value);
})