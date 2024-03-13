const REGEX_TRANSLATE_FIRST_VALUE = /([\d]+)%/;
const REGEX_TRANSLATE_SECOND_VALUE = /\s([\d]+)%/;

const gameBoardBox = document.querySelector(".game-container").getBoundingClientRect();
const blockBox = document.querySelector(".snake-head").getBoundingClientRect();
const widthRatio = parseInt(gameBoardBox.width / blockBox.width);
const heightRatio = parseInt(gameBoardBox.height / blockBox.height);

const gameOverDialog = document.getElementById("game-over-dialog");

function handleKeyDown(e) {
    switch (e.key) {
        case "ArrowUp":
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "down") return;
            currentDirection = "up";
            break;
        case "ArrowDown":
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "up") return;
            currentDirection = "down";
            break;
        case "ArrowRight":
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "left") return;
            currentDirection = "right";
            break;
        case "ArrowLeft":
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "right") return;
            currentDirection = "left";
            break;
    }
}
document.addEventListener("keydown", handleKeyDown);

generateFood();

var gameStarted = false;
var isGameOver = false;
var currentDirection = "up";
var tickDelay = 200;

function startGame() {
    const intervalId = setInterval(() => {
        moveLogic(currentDirection);

        if (isGameOver) {
            gameOverDialog.style.display = "flex";
            setTimeout(() => {
                gameOverDialog.showModal();
                gameOverDialog.classList.add("show-dialog");
            }, 1000);

            document.removeEventListener("keydown", handleKeyDown);

            clearInterval(intervalId);
            console.log("Game Over!");

            const gameContainer = document.querySelector(".game-container");
            const snake = [...gameContainer.children].filter(
                element => element.className !== "food"
            );
            snake.forEach(snakePart => {
                snakePart.style.backgroundColor = "#830037";
            });
        }
    }, tickDelay);
}

gameOverDialog.close();
gameOverDialog.addEventListener("click", e => {
    location.reload();
});

function moveLogic(direction) {
    const snakeHead = document.querySelector(".snake-head");
    const snakeBodies = document.querySelectorAll(".snake-body");

    let targetCol;
    let targetRow;

    switch (direction) {
        case "left":
            targetCol = parseInt(snakeHead.dataset.col) - 1;
            targetRow = snakeHead.dataset.row;
            if (targetIsSnakeBody(targetCol, targetRow) || snakeHead.dataset.col == 0) {
                console.log("Snake head cannot move left");
                isGameOver = true;
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
                generateFood();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "left";
            move("left", snakeHead);
            break;
        case "right":
            targetCol = parseInt(snakeHead.dataset.col) + 1;
            targetRow = snakeHead.dataset.row;
            if (
                targetIsSnakeBody(targetCol, targetRow) ||
                snakeHead.dataset.col == widthRatio - 1
            ) {
                console.log("Snake head cannot move right");
                isGameOver = true;
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
                generateFood();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "right";
            move("right", snakeHead);
            break;
        case "up":
            targetCol = snakeHead.dataset.col;
            targetRow = parseInt(snakeHead.dataset.row) - 1;
            if (targetIsSnakeBody(targetCol, targetRow) || snakeHead.dataset.row == 0) {
                console.log("Snake head cannot move up");
                isGameOver = true;
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
                generateFood();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "up";
            move("up", snakeHead);
            break;
        case "down":
            targetCol = snakeHead.dataset.col;
            targetRow = parseInt(snakeHead.dataset.row) + 1;
            if (
                targetIsSnakeBody(targetCol, targetRow) ||
                snakeHead.dataset.row == heightRatio - 1
            ) {
                console.log("Snake head cannot move down");
                isGameOver = true;
                return;
            } else if (targetIsFood(targetCol, targetRow)) {
                eatFood(targetCol, targetRow);
                snakeGrow();
                generateFood();
            }

            moveBodyPart(snakeBodies);
            snakeHead.dataset.next = "down";
            move("down", snakeHead);
            break;
    }
}

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

    const scoreSpan = document.getElementById("score-span");
    scoreSpan.textContent = parseInt(scoreSpan.textContent) + 1;
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

function generateFood() {
    let randCol = Math.floor(Math.random() * widthRatio);
    let randRow = Math.floor(Math.random() * heightRatio);

    if (targetIsSnakeBody(randCol, randRow)) {
        generateFood();
        return;
    }

    const newFood = document.createElement("div");
    newFood.classList.add("food");

    newFood.dataset.col = randCol;
    newFood.dataset.row = randRow;
    newFood.style.translate = `${randCol * 100}% ${randRow * 100}%`;

    const gameContainer = document.querySelector(".game-container");
    gameContainer.append(newFood);
}
