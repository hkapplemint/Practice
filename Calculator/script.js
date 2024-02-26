const digitBtns = document.querySelectorAll(".digit");
const display = document.querySelector(".display");
const allClearBtn = document.getElementById("AC-btn");
const deleteBtn = document.getElementById("delete-btn");
const showMoreBtn = document.getElementById("show-more-btn");
const showMoreRelateds = document.querySelectorAll(".show-more-related");
const equalBtn = document.getElementById("equal-btn");

digitBtns.forEach(digitBtn => {
    digitBtn.addEventListener("click", (e) => {
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

const str = "(12.66/-23)";
const regexHighOrderInfix = /(-?\d*\.?\d*)(?:[*\/])(-?\d*\.?\d*)/g;
console.log(regexHighOrderInfix.exec(str)[1]);

const regexNumbers = /[\d]+[.]?[\d]*/g;
const regexParen = /\(.*\)/g;  //return "(12.34*56.7)"

function calculate() {
    const inputString = display.value;
    //2340.32/-3.2
    const parenMatches = inputString.match(regexParen);
    console.log(parenMatches);
}

equalBtn.addEventListener("click", () => {
    calculate();
})