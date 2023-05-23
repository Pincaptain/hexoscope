/**
 * Handles the event which is fired when the game is created/recreated. (When the user clicks the "Create Game" button.)
 * It sets up the game state and variables, canvas events, chips, draws the chips and sets up the chips neighbours.
 */
const onGameCreated = () => {
  setupGameState();
  setupCanvasEvents();
  setupChips();
  drawChips();
  setupChipsNeighbours();
}

const setupGameState = () => {
  gameState = CREATE_POWER_STATIONS;
}

const setupCanvasEvents = () => {
  canvas.addEventListener("contextmenu", event => {
    event.preventDefault();
    event.stopPropagation();
  });

  canvas.addEventListener("mousedown", event => {
    switch (gameState) {
      case CREATE_POWER_STATIONS:
        onCreatePowerStationsMouseDown(event);
        break;
      case CREATE_CHIPS:
        onCreateChipsMouseDown(event);
        break;
      case PLAY:
        onPlayMouseDown(event);
        break;
    }
  });
}

const setupChips = () => {
  chips = [];

  let x = 0, y = 0, i = 0, j = 0;
  let isUp = true;

  while (y < canvas.height) {
    while (x < canvas.width) {
      if (willDrawOutsideOfBounds(x, y)) {
        break;
      }

      let drawnX, drawnY;

      if (isUp) {
        drawnX = x + (x === 0 ? 0 : chipWidth / 4);
        drawnY = y;
        x += chipWidth / 2 + (x === 0 ? 0 : chipWidth / 4);
        y += chipHeight / 2;
      } else {
        drawnX = x + (x === 0 ? 0 : chipWidth / 4);
        drawnY = y;
        x += chipWidth / 2 + chipWidth / 4;
        y -= chipHeight / 2;
      }

      chips.push(new Chip(drawnX, drawnY));

      isUp = !isUp;
      j++;
    }

    isUp = true;
    y = (i + 1) * chipHeight;
    x = 0;
    i++;
  }
}

const willDrawOutsideOfBounds = (x, y) => {
  return x + chipWidth > canvas.width || y + chipHeight > canvas.height;
}

const setupChipsNeighbours = () => {
  chips.forEach(chip => {
    setupChipNeighbours(chip);
  });
}

const setupChipNeighbours = (chip) => {
  const chipCenterX = chip.x + chipWidth / 2;
  const chipCenterY = chip.y + chipHeight / 2;
  const topLeftNeighbour = getChipAt(chipCenterX - chipWidth + chipWidth / 4, chipCenterY - chipHeight / 2);
  const topNeighbour = getChipAt(chipCenterX, chipCenterY - chipHeight);
  const topRightNeighbour = getChipAt(chipCenterX + chipWidth - chipWidth / 4, chipCenterY - chipHeight / 2);
  const bottomLeftNeighbour = getChipAt(chipCenterX - chipWidth + chipWidth / 4, chipCenterY + chipHeight / 2);
  const bottomNeighbour = getChipAt(chipCenterX, chipCenterY + chipHeight);
  const bottomRightNeighbour = getChipAt(chipCenterX + chipWidth - chipWidth / 4, chipCenterY + chipHeight / 2);

  chip.neighbours = {
    TOP_LEFT: {chip: topLeftNeighbour, isConnected: false},
    TOP: {chip: topNeighbour, isConnected: false},
    TOP_RIGHT: {chip: topRightNeighbour, isConnected: false},
    BOTTOM_LEFT: {chip: bottomLeftNeighbour, isConnected: false},
    BOTTOM: {chip: bottomNeighbour, isConnected: false},
    BOTTOM_RIGHT: {chip: bottomRightNeighbour, isConnected: false}
  };
}
