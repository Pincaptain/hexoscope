/**
 * Handles the event which is fired when the user clicks the "Next" button.
 * Based on the current game state it will either fire the onPlay event or it will fire the onCreateChips event.
 */
const onNext = () => {
  switch (gameState) {
    case CREATE_POWER_STATIONS:
      onCreatePowerStationsNext();
      break;
    case CREATE_CHIPS:
      onCreateChipsNext();
      break;
  }
}

const onCreatePowerStationsNext = () => {
  if (!validatePowerStations()) {
    return;
  }

  instructionsParagraph.innerHTML = "Left click on an unused chip to make it a standard chip. Once you press " +
    "a chip a prompt will appear asking you to input the connectors for the chip in this style " +
    "\"TOP, TOP_RIGHT...\". Once this is done press the \"Play\" button to start the game.";
  nextButton.innerHTML = "Play";

  onPowerStationsCreated();
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

  return true;
}

const onCreateChipsNext = () => {
  if (!validateChips()) {
    return;
  }

  instructionsParagraph.innerHTML = "I hope you enjoy the game!";
  nextButton.disabled = true;

  onPlay();
}

const validateChips = () => {
  const standardChips = chips.filter(chip => chip.type === STANDARD);

  if (standardChips.length === 0) {
    alert("Please add at least one standard chip.");
    return false;
  }

  return true;
}