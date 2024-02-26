const digitBtns = document.querySelectorAll(".digit");
const display = document.querySelector(".display");
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


digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {
        display.value += e.currentTarget.textContent;
    })
})

const regexOperators = /[x÷\+\-]/

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
    display.disabled = false;
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



function toFixedAndParseFloat(string) {
    return parseFloat(parseFloat(string).toFixed(10))
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
const regexParen = /\([^()]+\)/;
const regexExtractFormulaHighInfix = /(-?\d+\.?\d*)([x÷\/\*])(-?\d+\.?\d*)/;
const regexExtractFormulaLowInfix = /(-?\d+\.?\d*)([\+\-])(-?\d+\.?\d*)/;

function calculate(inputString) {
    //const inputString = display.value;
    //e.g. 230+(12.66*-23)-(32.1-34.1)
    //parenMatches = ["(12.66*-23)", "(32.1-34.1)"]
    let leftMostParen = display.value.match(regexParen);
    if(leftMostParen[0]) {
        console.log("Left Most Paren Exist")
        let formula = regexExtractFormulaHighInfix.exec(leftMostParen[0]);
        if (formula !== null) {
            let firstNumber = toFixedAndParseFloat(formula[1]);
            let infix = formula[2];
            let secondNumber = toFixedAndParseFloat(formula[3]);
    
            let result = switchFourOperators(firstNumber, infix, secondNumber)
    
            inputString = inputString.replace(leftMostParen[0], result);
            calculate(inputString);
        } else {
            formula = regexExtractFormulaLowInfix.exec(leftMostParen[0]);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
    
            result = switchFourOperators(firstNumber, infix, secondNumber)
            console.log(leftMostParen[0])
            inputString = inputString.replace(leftMostParen[0], result);
            calculate(inputString);
        }
        
    } else {
        console.log("Left most paren not exist")
        let leftMostFormula = inputString.match(regexExtractFormulaHighInfix);
        if(leftMostFormula !== null){
            formula = regexExtractFormulaHighInfix.exec(leftMostFormula);
            firstNumber = toFixedAndParseFloat(formula[1]);
            infix = formula[2];
            secondNumber = toFixedAndParseFloat(formula[3]);
            
            result = switchFourOperators(firstNumber, infix, secondNumber);
            inputString = inputString.replace(leftMostFormula[0], result);
            
        } else {
            leftMostFormula = inputString.match(regexExtractFormulaLowInfix);

            if(!leftMostFormula) {
                const isNumberCheck = inputString.match(/\d*\.?\d*/);
                display.value = isNumberCheck[0] === inputString
                    ? inputString
                    : "Syntax Error";
                if (display.value === "Syntax Error") {
                    display.disabled = true;
                }
                return
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

display.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        calculate(display.value);
    }
})