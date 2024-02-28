const sqRootBtn = document.getElementById("sq-root-btn");
const piBtn = document.getElementById("pi-btn");
const powerBtn = document.getElementById("power-btn");
const factorialBtn = document.getElementById("factorial-btn");

const display2 = document.getElementById("display");

sqRootBtn.addEventListener("click", e => {
    display2.value += sqRootBtn.textContent;
})

piBtn.addEventListener("click", e => {
    display2.value += piBtn.textContent;
})

powerBtn.addEventListener("click", e => {
    display2.value += powerBtn.textContent;
})

factorialBtn.addEventListener("click", e => {
    display2.value += factorialBtn.textContent;
})