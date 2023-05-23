/**
 * Handles the event which is fired when the browser window is loaded.
 * It sets up the event listeners for the menu buttons.
 */
const onLoad = () => {
  createGameButton.addEventListener("click", onCreateGame);
  nextButton.disabled = true;
  nextButton.addEventListener("click", onNext);
  instructionsParagraph.innerHTML = "Enter a width and height for the game board and press the \"Create Game\" button.";
}

const createGameButton = document.getElementById("menu__button__create-game");
const nextButton = document.getElementById("menu__button__next");
const instructionsParagraph = document.getElementById("menu__instructions");

window.addEventListener("load", onLoad);
