let swipeLibInitialX, swipeLibInitialY;
let swipeLibIsKeyDown = "false";
document.addEventListener("touchstart", e => {
    const touch = e.touches[0];
    swipeLibInitialX = touch.clientX;
    swipeLibInitialY = touch.clientY;
});
document.addEventListener(
    "touchmove",
    e => {
        e.preventDefault();

        const touch = e.changedTouches[0];
        const currentX = touch.clientX;
        const currentY = touch.clientY;

        const sensitivity = 20;
        const allowance = 20;

        const swipeLeft =
            currentX - swipeLibInitialX < -sensitivity &&
            Math.abs(currentY - swipeLibInitialY) < allowance;
        const swipeDown =
            currentY - swipeLibInitialY > sensitivity &&
            Math.abs(currentX - swipeLibInitialX) < allowance;
        const swipeUp =
            currentY - swipeLibInitialY < -sensitivity &&
            Math.abs(currentX - swipeLibInitialX) < allowance;
        const swipeRight =
            currentX - swipeLibInitialX > sensitivity &&
            Math.abs(currentY - swipeLibInitialY) < allowance;

        const leftArrowEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
        const downArrowEvent = new KeyboardEvent("keydown", { key: "ArrowDown" });
        const upArrowEvent = new KeyboardEvent("keydown", { key: "ArrowUp" });
        const rightArrowEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });

        if (swipeLibIsKeyDown) return;

        if (swipeLeft) {
            document.dispatchEvent(leftArrowEvent);
            swipeLibIsKeyDown = true;
        } else if (swipeDown) {
            document.dispatchEvent(downArrowEvent);
            swipeLibIsKeyDown = true;
        } else if (swipeUp) {
            document.dispatchEvent(upArrowEvent);
            swipeLibIsKeyDown = true;
        } else if (swipeRight) {
            document.dispatchEvent(rightArrowEvent);
            swipeLibIsKeyDown = true;
        }
    },
    { passive: false }
);

document.addEventListener("touchend", () => {
    swipeLibIsKeyDown = false;
});
document.addEventListener("touchcancel", () => {
    swipeLibIsKeyDown = false;
});
