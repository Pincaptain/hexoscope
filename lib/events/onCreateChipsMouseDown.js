/**
 * Handles the mouse down event on the canvas when the user is creating chips.
 * Creates a chip at the mouse position and prompts the user for the neighbours of the chip.
 * @param event
 */
const onCreateChipsMouseDown = event => {
  if (event.button !== 0) {
    return;
  }

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!validateClickedChip(chip)) {
    return;
  }

  const connectors = prompt("Please enter the connectors for the chip in the following format: " +
    "TOP, TOP_RIGHT, TOP_LEFT, BOTTOM, BOTTOM_RIGHT, BOTTOM_LEFT.");
  const connectorsArray = validateConnectors(connectors);

  if (!connectorsArray) {
    return;
  }

  chip.type = STANDARD;

  SIDES.forEach(side => {
    if (connectorsArray.includes(side)) {
      chip.neighbours[side].isConnected = true;
    }
  });

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