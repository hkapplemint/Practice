const REGEX_TRANSLATE_FIRST_VALUE = /([\d]+)%/;
const REGEX_TRANSLATE_SECOND_VALUE = /\s([\d]+)%/;

const gameBoardBox = document.querySelector(".game-container").getBoundingClientRect();
const blockBox = document.querySelector(".snake-head").getBoundingClientRect();
const widthRatio = parseInt(gameBoardBox.width / blockBox.width);
const heightRatio = parseInt(gameBoardBox.height / blockBox.height);

document.addEventListener("keydown", e => {
  const snakeHead = document.querySelector(".snake-head");
  const snakeBodies = document.querySelectorAll(".snake-body");

  let nextDirection;
  switch (e.key) {
    case "ArrowUp":
      [...snakeBodies].forEach(snakeBody => {
        nextDirection = calculateNextDirection(snakeBody);
        move(nextDirection, snakeBody);
      });
      move("up", snakeHead);
      break;
    case "ArrowDown":
      [...snakeBodies].forEach(snakeBody => {
        nextDirection = calculateNextDirection(snakeBody);
        move(nextDirection, snakeBody);
      });
      move("down", snakeHead);
      break;
    case "ArrowRight":
      [...snakeBodies].forEach(snakeBody => {
        nextDirection = calculateNextDirection(snakeBody);
        move(nextDirection, snakeBody);
      });
      move("right", snakeHead);
      break;
    case "ArrowLeft":
      [...snakeBodies].forEach(snakeBody => {
        nextDirection = calculateNextDirection(snakeBody);
        move(nextDirection, snakeBody);
      });
      move("left", snakeHead);
      break;
  }
});

function calculateNextDirection(element) {
  const previousBodyPartId = parseInt(element.id) - 1;
  const previousBodyPart = document.getElementById(`${previousBodyPartId}`);
  console.log("EVALUATING NEW BODY PART");
  console.log("previous body part:", previousBodyPart.className);
  const previousBodyPartX = parseInt(
    REGEX_TRANSLATE_FIRST_VALUE.exec(previousBodyPart.style.translate)[1]
  );
  const previousBodyPartY = parseInt(
    REGEX_TRANSLATE_SECOND_VALUE.exec(previousBodyPart.style.translate)[1]
  );
  const currentBodyPartX = parseInt(REGEX_TRANSLATE_FIRST_VALUE.exec(element.style.translate)[1]);
  const currentBodyPartY = parseInt(REGEX_TRANSLATE_SECOND_VALUE.exec(element.style.translate)[1]);

  console.log(previousBodyPartX, previousBodyPartY, currentBodyPartX, currentBodyPartY);

  if (previousBodyPartX > currentBodyPartX) {
    console.log(previousBodyPartX, ">", currentBodyPartX, "returning right");
    return "right";
  } else if (previousBodyPartX < currentBodyPartX) {
    console.log(previousBodyPartX, "<", currentBodyPartX, "returning left");
    return "left";
  } else if (previousBodyPartY > currentBodyPartY) {
    console.log(previousBodyPartY, ">", currentBodyPartY, "returning down");
    return "down";
  } else if (previousBodyPartY < currentBodyPartY) {
    console.log(previousBodyPartY, "<", currentBodyPartY, "returning up");
    return "up";
  }
}

function move(direction, element) {
  const xValue = REGEX_TRANSLATE_FIRST_VALUE.exec(element.style.translate)[1];
  const yValue = REGEX_TRANSLATE_SECOND_VALUE.exec(element.style.translate)[1];

  let newXValue = xValue,
    newYValue = yValue;
  switch (direction) {
    case "up":
      newYValue = parseInt(yValue) - 100;
      break;
    case "down":
      newYValue = parseInt(yValue) + 100;
      break;
    case "right":
      newXValue = parseInt(xValue) + 100;
      break;
    case "left":
      newXValue = parseInt(xValue) - 100;
      break;
  }

  if (
    newYValue < 0 ||
    newXValue < 0 ||
    newXValue > (widthRatio - 1) * 100 ||
    newYValue > (heightRatio - 1) * 100
  )
    return;

  element.style.translate = `${newXValue}% ${newYValue}%`;
}
