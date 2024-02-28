const changeColorBtns = document.querySelectorAll(".change-color-btn");

changeColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.body.style.background = btn.style.background;
    })
})

changeColorBtns[0].click();