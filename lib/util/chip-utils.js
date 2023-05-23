/**
 * Draws the chips on the canvas.
 */
const drawChips = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  chips.forEach(chip => {
    chip.draw();
  });
}

/**
 * Returns the chip at the given coordinates.
 * @param x
 * @param y
 * @returns {Chip|null}
 */
const getChipAt = (x, y) => {
  return chips.find(chip => chip.contains(x, y)) || null;
}

/**
 * Validates if the given chip is not null and is not already used (meaning it is not already assigned to a type).
 * @param chip
 * @returns {boolean}
 */
const validateClickedChip = chip => {
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

/**
 * Activates the chips recursively starting from the source chips.
 * Activating a chip means that it is marked as active and all of its neighbours are marked as active as well.
 */
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

/**
 * Checks if the user has won the game by checking if all the receiver chips are active.
 */
const checkWin = () => {
  const isWin = chips.filter(chip => chip.type === RECEIVER)
    .every(chip => chip.isActive);

  if (!isWin) {
    return;
  }

  const ok = confirm('You win! Press OK to restart.');

  if (ok) {
    drawChips();
    Canvas2Image.saveAsPNG(canvas);
    location.reload(); // TODO: This is a hack. Find a better way to restart the game.
  }
}