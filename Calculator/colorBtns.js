const changeColorBtns = document.querySelectorAll(".change-color-btn");

changeColorBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        changeColorBtns.forEach(btn => {
            btn.classList.remove("change-color-btn-expand")
        })
        e.currentTarget.classList.add("change-color-btn-expand")
    })
})