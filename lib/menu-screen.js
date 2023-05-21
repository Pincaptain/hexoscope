const onCreateGame = () => {
  const widthField = document.getElementById("menu__input__width");
  const heightField = document.getElementById("menu__input__height");
  const width = widthField.value;
  const height = heightField.value;

  if (!validDimensions(width, height)) {
    return;
  }

  canvas = createCanvas(width, height);
  context = canvas.getContext("2d");
  nextButton.addEventListener("click", onNext);
  nextButton.disabled = false;
  nextButton.innerHTML = "Next";
  instructionsParagraph.innerHTML = "Right click on an inactive chip to make it a source chip and left click on an" +
    " inactive chip to make it a receiver chip. Once this is done press the \"Next\" button to continue.";

  onGameCreated();
}

const validDimensions = (width, height) => {
  if (!width || !height) {
    alert("Please enter a width and height for the game board.");
    return false;
  }

  if (width < 640 || height < 480) {
    alert("The minimum width is 640 and the minimum height is 480.");
    return false;
  }

  return true;
}

const createCanvas = (width, height) => {
  const canvasContainer = document.getElementById("canvas__container");

  if (canvasContainer.hasChildNodes()) {
    canvasContainer.removeChild(canvasContainer.childNodes[0]);
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  canvasContainer.appendChild(canvas);

  return canvas;
}

const onNext = () => {
  if (gameState === CREATE_POWER_STATIONS) {
    const arePowerStationsValid = validatePowerStations();

    if (!arePowerStationsValid) {
      return;
    }

    gameState = CREATE_CHIPS;
    instructionsParagraph.innerHTML = "Left click on an unused chip to make it a standard chip. Once you press " +
      "a chip a prompt will appear asking you to input the connectors for the chip in this style " +
      "\"TOP, TOP_RIGHT...\". Once this is done press the \"Play\" button to start the game.";
    nextButton.innerHTML = "Play";
  } else if (gameState === CREATE_CHIPS) {
    const areChipsValid = validateChips();

    if (!areChipsValid) {
      return;
    }

    gameState = PLAY;
    instructionsParagraph.innerHTML = "I hope you enjoy the game!";
    nextButton.disabled = true;
    nextButton.onclick = null;

    onPlay();
  }
}

const createGameButton = document.getElementById("menu__button__create-game");
createGameButton.addEventListener("click", onCreateGame);

const nextButton = document.getElementById("menu__button__next");
const instructionsParagraph = document.getElementById("menu__instructions");
