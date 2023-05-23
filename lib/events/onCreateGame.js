/**
 * Handles the event which is fired when the user clicks the "Create Game" button.
 * It fetches the width and height from the input fields and creates the canvas and context.
 */
const onCreateGame = () => {
  const width = widthInput.value;
  const height = heightInput.value;
  const areDimensionsValid = validateDimensions(width, height);

  if (!areDimensionsValid) {
    return;
  }

  canvas = createCanvas(width, height);
  context = canvas.getContext("2d");
  nextButton.disabled = false;
  nextButton.innerHTML = "Next";
  instructionsParagraph.innerHTML = "Right click on an inactive chip to make it a source chip and left click on an" +
    " inactive chip to make it a receiver chip. Once this is done press the \"Next\" button to continue.";

  onGameCreated();
}

const validateDimensions = (width, height) => {
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
  if (canvasContainer.hasChildNodes()) {
    canvasContainer.removeChild(canvasContainer.childNodes[0]);
  }

  const canvasElement = document.createElement("canvas");
  canvasElement.setAttribute("id", "canvas");
  canvasElement.setAttribute("width", width);
  canvasElement.setAttribute("height", height);

  return canvasContainer.appendChild(canvasElement);
}

const widthInput = document.getElementById("menu__input__width");
const heightInput = document.getElementById("menu__input__height");
const canvasContainer = document.getElementById("canvas__container");
