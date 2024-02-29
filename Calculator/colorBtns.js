const changeColorBtns = document.querySelectorAll(".change-color-btn");
const calculator = document.querySelector(".calculator");

changeColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.body.style.backgroundColor = btn.style.backgroundColor;
        // document.body.classList.toggle("lilac-theme");
    })
})

changeColorBtns[0].click();