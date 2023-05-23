/**
 * Handles the mouse down event for the canvas when the user is creating power stations.
 * Creates a power station at the mouse position and based on the mouse button clicked, sets the power station type.
 * @param event
 */
const onCreatePowerStationsMouseDown = event => {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!validateClickedChip(chip)) {
    return;
  }

  if (event.button === 0) {
    activatePowerStation(chip, SOURCE);
  } else if (event.button === 2) {
    activatePowerStation(chip, RECEIVER);
  } else {
    alert("Please use the left or right mouse button to select the chip type based on the instructions.");
    return;
  }

  drawChips();
}

const activatePowerStation = (chip, type) => {
  chip.type = type;

  SIDES.forEach(side => {
    chip.neighbours[side].isConnected = true;
  });
}
