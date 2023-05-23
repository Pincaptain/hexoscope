/**
 * Handles the event which is fired when the user clicks the "Play" button.
 * Activates the chips, redraws the chips and checks if the user has won.
 */
const onPlay = () => {
  gameState = PLAY;

  activateChips();
  drawChips();
  checkWin();
}