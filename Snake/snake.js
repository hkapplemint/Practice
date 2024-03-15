const REGEX_TRANSLATE_FIRST_VALUE = /([\d]+)%/;
const REGEX_TRANSLATE_SECOND_VALUE = /\s([\d]+)%/;

let gameBoardBox, blockBox, widthRatio, heightRatio;
let blockSize = "5%";
let generateFoodTryCount = 0;

function getLatestBoxSize() {
    return new Promise(resolve => {
        setTimeout(() => {
            const gameBoardBox = document.querySelector(".game-container").getBoundingClientRect();
            const blockBox = document.querySelector(".snake-head").getBoundingClientRect();
            const widthRatio = parseInt(gameBoardBox.width / blockBox.width);
            const heightRatio = parseInt(gameBoardBox.height / blockBox.height);

            resolve({
                gameBoardBox: gameBoardBox,
                blockBox: blockBox,
                widthRatio: widthRatio - 1,
                heightRatio: heightRatio - 1,
            });
        }, 20);
    });
}

const gameOverDialog = document.getElementById("game-over-dialog");
const settingBtn = document.getElementById("setting");
const settingContainer = document.querySelector(".setting-container");
const rowInput = document.getElementById("row-input");
const colInput = document.getElementById("column-input");
const speedInput = document.getElementById("speed-input");

let acceptNewInput = true;

function handleKeyDown(e) {
    if (!acceptNewInput) return;
    switch (e.key) {
        case "ArrowUp":
            acceptNewInput = false;
            e.preventDefault();
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "down") return;
            currentDirection = "up";
            break;
        case "ArrowDown":
            acceptNewInput = false;
            e.preventDefault();
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "up") return;
            currentDirection = "down";
            break;
        case "ArrowRight":
            acceptNewInput = false;
            e.preventDefault();
            if (gameStarted === false) {
                if (currentDirection === "down") return;
                startGame();
                gameStarted = true;
            }
            if (currentDirection === "left") return;
            currentDirection = "right";
            break;
        case "ArrowLeft":
            acceptNewInput = false;
            e.preventDefault();
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

let intervalId;

function startGame() {
    colInput.disabled = "true";
    rowInput.disabled = "true";
    intervalId = setInterval(handleInterval, tickDelay);
}

gameOverDialog.close();
gameOverDialog.addEventListener("click", e => {
    location.reload();
});

function moveLogic(direction) {
    const snakeHead = document.querySelector(".snake-head");
    const snakeBodies = document.querySelectorAll(".snake-body");

    const { widthRatio, heightRatio } = getLatestBoxSize();

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

            acceptNewInput = true;
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

            acceptNewInput = true;
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

            acceptNewInput = true;
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

            acceptNewInput = true;
            break;
    }
}

function move(direction, element) {
    const { widthRatio, heightRatio } = getLatestBoxSize();

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
    newBodyPart.style.height = blockSize;
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

async function generateFood() {
    const { widthRatio, heightRatio } = await getLatestBoxSize();
    if (generateFoodTryCount > widthRatio * heightRatio) {
        console.error("No place to generate food");
        return;
    }

    const snakeHead = document.querySelector(".snake-head");

    let randCol = Math.floor(Math.random() * widthRatio);
    let randRow = Math.floor(Math.random() * heightRatio);

    if (
        targetIsSnakeBody(randCol, randRow) ||
        randCol > widthRatio ||
        randRow > heightRatio ||
        (randCol == snakeHead.dataset.col && randRow == snakeHead.dataset.row)
    ) {
        generateFoodTryCount++;
        generateFood();
        return;
    }

    const newFood = document.createElement("div");
    newFood.classList.add("food");

    newFood.dataset.col = randCol;
    newFood.dataset.row = randRow;
    newFood.style.height = blockSize;
    newFood.style.translate = `${randCol * 100}% ${randRow * 100}%`;

    const gameContainer = document.querySelector(".game-container");
    gameContainer.append(newFood);
}

settingBtn.addEventListener("click", e => {
    settingContainer.classList.toggle("open");
    settingBtn.classList.toggle("rotating");
});

speedInput.value = tickDelay;
speedInput.addEventListener("change", () => {
    tickDelay = speedInput.value;

    if (!gameStarted) return;
    clearInterval(intervalId);
    intervalId = setInterval(handleInterval, tickDelay);
});

colInput.addEventListener("change", () => {
    handleColRowChanges(colInput.value, rowInput.value);
});
rowInput.addEventListener("change", () => {
    handleColRowChanges(colInput.value, rowInput.value);
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" || (e.ctrlKey && e.key === "s")) {
        e.preventDefault();
        settingContainer.classList.remove("open");
        settingBtn.classList.remove("rotating");
    }
});

function handleColRowChanges(col, row) {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.style.aspectRatio = `${colInput.value} / ${rowInput.value}`;

    removeFood();
    generateFood();
    randomizeSnakePosition(col, row);

    changeSnakeFoodSize();
}
async function randomizeSnakePosition(col, row) {
    // const { widthRatio, heightRatio } = await getLatestBoxSize();
    const colLimit = parseInt(col);
    const rowLimit = parseInt(row);

    const snakeHeadDiv = document.querySelector(".snake-head");
    const snakeBodyDivs = document.querySelectorAll(".snake-body");

    snakeHeadDiv.dataset.col = Math.floor(Math.random() * colLimit);
    snakeHeadDiv.dataset.row = Math.floor(Math.random() * rowLimit);
    snakeHeadDiv.style.translate = `${parseInt(snakeHeadDiv.dataset.col) * 100}% ${
        parseInt(snakeHeadDiv.dataset.row) * 100
    }%`;

    [...snakeBodyDivs].forEach((snakeBody, index) => {
        snakeBody.dataset.col = snakeHeadDiv.dataset.col;
        snakeBody.dataset.row = parseInt(snakeHeadDiv.dataset.row) + 1 + parseInt(index);
        snakeBody.style.translate = `${snakeBody.dataset.col * 100}% ${
            snakeBody.dataset.row * 100
        }%`;
    });
}

function changeSnakeFoodSize() {
    const snakeHeadDiv = document.querySelector(".snake-head");
    const snakeBodyDivs = document.querySelectorAll(".snake-body");
    const newSize = `${100 / Math.min(colInput.value, rowInput.value)}%`;
    snakeHeadDiv.style.height = newSize;
    [...snakeBodyDivs].forEach(snakeBody => {
        snakeBody.style.height = newSize;
    });

    setTimeout(() => {
        const foodDiv = document.querySelector(".food");
        foodDiv.style.height = newSize;
    }, 21);

    blockSize = newSize;
}

function removeFood() {
    const food = document.querySelector(".food");
    food.remove();
}

function handleInterval() {
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
        const snake = [...gameContainer.children].filter(element => element.className !== "food");
        snake.forEach(snakePart => {
            snakePart.style.backgroundColor = "#830037";
        });
    }
}
