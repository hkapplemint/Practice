const digitBtns = document.querySelectorAll(".digit");
const display = document.querySelector(".display");
const allClearBtn = document.getElementById("AC-btn");
const deleteBtn = document.getElementById("delete-btn");

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


function deleteBtnFx() {
    if(display.value.length > 0) {
        display.value = display.value.slice(0, -1);
    }
}