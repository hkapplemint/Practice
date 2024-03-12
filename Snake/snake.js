const REGEX_TRANSLATE_FIRST_VALUE = /([\d]+)%/;
const REGEX_TRANSLATE_SECOND_VALUE = /\s([\d]+)%/;

const gameBoardBox = document.querySelector(".game-container").getBoundingClientRect();
const blockBox = document.querySelector(".snake-head").getBoundingClientRect();
const widthRatio = parseInt(gameBoardBox.width / blockBox.width);
const heightRatio = parseInt(gameBoardBox.height / blockBox.height);

document.addEventListener("keydown", e => {
    const snakeHead = document.querySelector(".snake-head");
    const snakeBodies = document.querySelectorAll(".snake-body");

    let targetCol;
    let targetRow;
    switch (e.key) {
        case "ArrowUp":
            targetCol = snakeHead.dataset.col;
            targetRow = parseInt(snakeHead.dataset.row) - 1;
            if (targetIsSnakeBody(targetCol, targetRow) || snakeHead.dataset.row == 0) {
                console.log("Snake head cannot move up");
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "up";
            move("up", snakeHead);

            if (foodEaten) generateFood();
            break;
        case "ArrowDown":
            targetCol = snakeHead.dataset.col;
            targetRow = parseInt(snakeHead.dataset.row) + 1;
            if (
                targetIsSnakeBody(targetCol, targetRow) ||
                snakeHead.dataset.row == heightRatio - 1
            ) {
                console.log("Snake head cannot move down");
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "down";
            move("down", snakeHead);

            if (foodEaten) generateFood();
            break;
        case "ArrowRight":
            targetCol = parseInt(snakeHead.dataset.col) + 1;
            targetRow = snakeHead.dataset.row;
            if (
                targetIsSnakeBody(targetCol, targetRow) ||
                snakeHead.dataset.col == widthRatio - 1
            ) {
                console.log("Snake head cannot move right");
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "right";
            move("right", snakeHead);

            if (foodEaten) generateFood();
            break;
        case "ArrowLeft":
            targetCol = parseInt(snakeHead.dataset.col) - 1;
            targetRow = snakeHead.dataset.row;
            if (targetIsSnakeBody(targetCol, targetRow) || snakeHead.dataset.col == 0) {
                console.log("Snake head cannot move left");
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "left";
            move("left", snakeHead);

            if (foodEaten) generateFood();
            break;
    }
});

function move(direction, element) {
    switch (direction) {
        case "up":
            if (element.dataset.row == 0) return;
            element.dataset.row = parseInt(element.dataset.row) - 1;
            break;
        case "down":
            if (element.dataset.row == heightRatio - 1) return;
            element.dataset.row = parseInt(element.dataset.row) + 1;
            break;
        case "left":
            if (element.dataset.col == 0) return;
            element.dataset.col = parseInt(element.dataset.col) - 1;
            break;
        case "right":
            if (element.dataset.col == widthRatio - 1) return;
            element.dataset.col = parseInt(element.dataset.col) + 1;
            break;
    }

    element.style.translate = `${parseInt(element.dataset.col) * 100}% ${
        parseInt(element.dataset.row) * 100
    }%`;
}

function targetIsSnakeBody(col, row) {
    const targetSpace = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
    if (targetSpace !== null && targetSpace.className === "snake-body") {
        return true;
    } else {
        return false;
    }
}
function targetIsFood(col, row) {
    const targetSpace = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
    if (targetSpace === null) return;
    if (targetSpace.className === "food") {
        return true;
    } else {
        return false;
    }
}
function eatFood(col, row) {
    const targetFood = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
    targetFood.remove();
    foodEaten = true;
}
function snakeGrow() {
    const snakeBodies = document.querySelectorAll(".snake-body");
    const snakeBodiesArr = [...snakeBodies];
    const lastBodyPart = snakeBodiesArr[snakeBodiesArr.length - 1];

    const newBodyPart = document.createElement("div");
    newBodyPart.classList.add("snake-body");
    newBodyPart.dataset.col = lastBodyPart.dataset.col;
    newBodyPart.dataset.row = lastBodyPart.dataset.row;
    newBodyPart.id = parseInt(lastBodyPart.id) + 1;
    newBodyPart.style.translate = `${parseInt(newBodyPart.dataset.col) * 100}% ${
        parseInt(newBodyPart.dataset.row) * 100
    }%`;

    const gameContainer = document.querySelector(".game-container");
    gameContainer.append(newBodyPart);
}

function moveBodyPart(nodeList) {
    [...nodeList].reverse().forEach(snakeBody => {
        const nextBodyPart = document.getElementById(`${snakeBody.id - 1}`);
        snakeBody.dataset.next = nextBodyPart.dataset.next;
        move(snakeBody.dataset.next, snakeBody);
    });
}

var foodEaten = false;
function generateFood() {
    const randCol = Math.floor(Math.random() * widthRatio);
    const randRow = Math.floor(Math.random() * heightRatio);

    const newFood = document.createElement("div");
    newFood.classList.add("food");

    newFood.dataset.col = randCol;
    newFood.dataset.row = randRow;
    newFood.style.translate = `${randCol * 100}% ${randRow * 100}%`;

    const gameContainer = document.querySelector(".game-container");
    gameContainer.append(newFood);

    foodEaten = false;
}

generateFood();
