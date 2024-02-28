const changeColorBtns = document.querySelectorAll(".change-color-btn");

changeColorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        changeColorBtns.forEach(element => {
            element.classList.add("change-color-btn-shrink");
            element.classList.remove("change-color-btn-expand");
        });
        btn.classList.remove("change-color-btn-shrink");
        btn.classList.add("change-color-btn-expand");
    })
})

changeColorBtns[0].click();