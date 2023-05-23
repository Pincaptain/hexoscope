/**
 * Handles the mouse down event on the canvas when the user is playing the game.
 * If the user clicks the left mouse button, it selects the chip if it can be swapped and deselects it if it is already
 * selected. On the other hand, if a chip is already selected, it swaps the chips if the other chip can be swapped.
 * @param event
 */
const onPlayMouseDown = event => {
  if (event.button !== 0) {
    return;
  }

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const chip = getChipAt(x, y);

  if (!chip || !chip.canBeSwapped()) {
    return;
  }

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

  drawChips();
}

const swapChips = (chip, otherChip) => {
  const chipSideToIsConnectedMap = getSideToIsConnectedMap(chip);
  const otherChipSideToIsConnectedMap = getSideToIsConnectedMap(otherChip);

  recalculateNeighbours(chip, otherChipSideToIsConnectedMap);
  recalculateNeighbours(otherChip, chipSideToIsConnectedMap);

  selectedChip = null;
}

const getSideToIsConnectedMap = chip => {
  const map = {};

  SIDES.forEach(side => {
    const neighbour = chip.neighbours[side];
    map[side] = neighbour.isConnected;
  });

  return map;
}

const recalculateNeighbours = (chip, sideToIsConnectedMap) => {
  SIDES.forEach(side => {
    chip.neighbours[side].isConnected = sideToIsConnectedMap[side];
  });
}