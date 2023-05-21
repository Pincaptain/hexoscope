let canvas;
let context;
let gameState = MENU;
let chips = [];
let selectedChip = null;

const onGameCreated = () => {
  setupGame();
  setupCanvasEvents();
  setupChips();
  drawChips();
  setupChipsNeighbours();
}

const setupGame = () => {
  gameState = CREATE_POWER_STATIONS;
  chips = [];
}

const setupCanvasEvents = () => {
  canvas.oncontextmenu = event => {
    event.preventDefault();
    event.stopPropagation();
  };

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
  }, false);
}

const onCreatePowerStationsMouseDown = event => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!isValidChip(chip)) {
    return;
  }

  let wasActivated = false;

  if (event.button === 0) {
    wasActivated = activatePowerStation(chip, SOURCE);
  } else if (event.button === 2) {
    wasActivated = activatePowerStation(chip, RECEIVER);
  } else {
    alert("Please use the left or right mouse button to select the chip type based on the instructions.");
  }

  if (wasActivated) {
    drawChips();
  }
}

const isValidChip = chip => {
  if (!chip) {
    alert("Please select a chip.");
    return false;
  }

  if (chip.isUsed()) {
    alert("Please select a chip that is not already used.");
    return false;
  }

  return true;
}

const activatePowerStation = (chip, type) => {
  chip.type = type;

  Object.keys(chip.neighbours).forEach(side => {
    chip.neighbours[side].isConnected = true;
  });

  return true;
}

const validatePowerStations = () => {
  const powerStations = chips
    .filter(chip => chip.isUsed() && chip.type !== STANDARD)
    .reduce((acc, chip) => {
      acc[chip.type].push(chip);
      return acc;
    }, {[SOURCE]: [], [RECEIVER]: []});

  if (powerStations[SOURCE].length === 0) {
    alert("Please add at least one power source.");
    return false;
  }

  if (powerStations[RECEIVER].length === 0) {
    alert("Please add at least one power receiver.");
    return false;
  }

  if (powerStations[SOURCE].length !== powerStations[RECEIVER].length) {
    alert("The number of power sources must equal the number of receivers.");
    return false;
  }

  return true;
}

const onCreateChipsMouseDown = event => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!isValidChip(chip)) {
    return;
  }

  const connectors = prompt("Please enter the connectors for the chip in the following format: " +
    "TOP, TOP_RIGHT, TOP_LEFT, BOTTOM, BOTTOM_RIGHT, BOTTOM_LEFT.");
  const connectorsArray = validateConnectors(connectors);

  if (!connectorsArray) {
    return;
  }

  if (event.button === 0) {
    chip.type = STANDARD;
    Object.keys(chip.neighbours).forEach(side => {
      if (connectorsArray.includes(side)) {
        chip.neighbours[side].isConnected = true;
      }
    });
  }

  drawChips();
}

const validateConnectors = connectors => {
  if (!connectors) {
    alert("Please enter the connectors for the chip.");
    return null;
  }

  const connectorsArray = connectors.split(",")
    .map(connector => connector.trim().toUpperCase());
  const areConnectorsValid = connectorsArray.every(connector => SIDES.includes(connector));

  if (!areConnectorsValid) {
    alert("Please enter valid connectors for the chip.");
    return null;
  }

  return connectorsArray;
}

const validateChips = () => {
  const standardChips = chips.filter(chip => chip.type === STANDARD);

  if (standardChips.length === 0) {
    alert("Please add at least one standard chip.");
    return false;
  }

  return true;
}

const onPlay = () => {
  activateChips();
  drawChips();
  checkWin();
}

const onPlayMouseDown = event => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!chip || !chip.canBeSwapped()) {
    return;
  }

  if (event.button === 0) {
    if (!selectedChip) {
      selectedChip = chip;
    } else {
      if (selectedChip === chip) {
        selectedChip = null;
      } else {
        if (!chip.canBeSwapped()) {
          return;
        }

        swapChips(selectedChip, chip);
        activateChips();
        checkWin();
      }
    }
  }

  drawChips();
}

const swapChips = (chip, otherChip) => {
  const chipSideToIsConnectedMap = getSideToIsConnectedMap(chip);
  const otherChipSideToIsConnectedMap = getSideToIsConnectedMap(otherChip);

  recalculateNeighbours(chip, otherChipSideToIsConnectedMap);
  recalculateNeighbours(otherChip, chipSideToIsConnectedMap);

  selectedChip = null;
}

const recalculateNeighbours = (chip, sideToIsConnectedMap) => {
  SIDES.forEach(side => {
    chip.neighbours[side].isConnected = sideToIsConnectedMap[side];
  });
}

const getSideToIsConnectedMap = chip => {
  const map = {};

  Object.keys(chip.neighbours).forEach(side => {
    const neighbour = chip.neighbours[side];
    map[side] = neighbour.isConnected;
  });

  return map;
}

const setupChips = () => {
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

const getChipAt = (x, y) => {
  for (let i = 0; i < chips.length; i++) {
    const chip = chips[i];
    if (chip.x <= x && x <= chip.x + chipWidth && chip.y <= y && y <= chip.y + chipHeight) {
      return chip;
    }
  }
  return null;
}

const willDrawOutsideOfBounds = (x, y) => {
  return x + chipWidth > canvas.width || y + chipHeight > canvas.height;
}

const drawChips = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  chips.forEach(chip => {
    chip.draw(context);
  });
}

const activateChips = () => {
  chips.forEach(chip => {
    if (chip.type !== SOURCE) {
      chip.isActive = false;
    }
  });

  const sourceChips = chips.filter(chip => chip.type === SOURCE);

  sourceChips.forEach(sourceChip => {
    sourceChip.isActive = true;
    activateChipsRecursively(sourceChip);
  });
}

const activateChipsRecursively = (chip) => {
  SIDES.forEach(side => {
    const neighbour = chip.neighbours[side];

    if (!neighbour.chip) {
      return;
    }

    const chipToNeighbourConnection = neighbour.isConnected;
    const neighbourToChipConnection = neighbour.chip.neighbours[getOppositeSide(side)].isConnected;

    if (chipToNeighbourConnection && neighbourToChipConnection && !neighbour.chip.isActive) {
      neighbour.chip.isActive = true;

      if (neighbour.chip.type !== RECEIVER) {
        activateChipsRecursively(neighbour.chip);
      }
    }
  });
}

const getOppositeSide = side => {
  switch (side) {
    case TOP_LEFT:
      return BOTTOM_RIGHT;
    case TOP:
      return BOTTOM;
    case TOP_RIGHT:
      return BOTTOM_LEFT;
    case BOTTOM_LEFT:
      return TOP_RIGHT;
    case BOTTOM:
      return TOP;
    case BOTTOM_RIGHT:
      return TOP_LEFT;
  }
}

const checkWin = () => {
  const receiverChips = chips.filter(chip => chip.type === RECEIVER);
  const isWin = receiverChips.every(chip => chip.isActive);

  if (!isWin) {
    return;
  }

  const ok = confirm('You win! Press OK to restart.');

  if (ok) {
    drawChips();
    Canvas2Image.saveAsPNG(canvas);
    location.reload();
  }
}
