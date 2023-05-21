class Chip {
  constructor(x, y) {
    this.id = crypto.randomUUID();
    this.x = x;
    this.y = y;
    this.type = null;
    this.isActive = false;
    this.neighbours = {};
  }

  isUsed() {
    return this.type !== null;
  }

  canBeSwapped() {
    if (this.type !== STANDARD) {
      return false;
    }

    return SIDES.map(side => this.neighbours[side])
      .map(neighbour => neighbour.chip)
      .filter(chip => chip !== null)
      .filter(chip => chip.type === STANDARD)
      .some(chip => chip.isActive);
  }

  draw() {
    if (!this.shouldDrawChip()) {
      return;
    }

    this.setupChipColors();
    this.drawChip();
    this.setupConnectorColors();
    this.drawConnectors();
  }

  shouldDrawChip() {
    if (gameState !== PLAY) {
      return true;
    }

    return this.isUsed();
  }

  setupChipColors() {
    switch (this.type) {
      case STANDARD:
        if (selectedChip && selectedChip.id === this.id) {
          context.fillStyle = selectedChipFillStyle;
          break;
        }

        if (this.isActive) {
          context.fillStyle = activeChipFillStyle;
          break;
        }

        context.fillStyle = chipFillStyle;
        break;
      case SOURCE:
        context.fillStyle = sourceChipFillStyle;
        break;
      case RECEIVER:
        context.fillStyle = receiverChipFillStyle;
        break;
      default:
        context.fillStyle = inactiveChipFillStyle;
    }

    context.strokeStyle = chipStrokeStyle;
  }

  drawChip() {
    const x = this.x;
    const y = this.y;

    context.beginPath();
    context.moveTo(x, y + chipHeight / 2);
    context.lineTo(x + chipWidth / 4, y);
    context.lineTo(x + 3 * chipWidth / 4, y);
    context.lineTo(x + chipWidth, y + chipHeight / 2);
    context.lineTo(x + 3 * chipWidth / 4, y + chipHeight);
    context.lineTo(x + chipWidth / 4, y + chipHeight);
    context.closePath();
    context.fill();
    context.stroke();
  }

  setupConnectorColors() {
    context.fillStyle = connectorFillStyle;
  }

  drawConnectors() {
    const x = this.x;
    const y = this.y;

    Object.keys(this.neighbours).forEach((side) => {
      const neighbour = this.neighbours[side];

      if (neighbour.isConnected) {
        context.beginPath();

        switch (side) {
          case TOP_LEFT:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + chipWidth / 4 - chipWidth / 4 + chipWidth / 8, y + chipHeight / 4);
            break;
          case TOP:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + chipWidth / 2, y);
            break;
          case TOP_RIGHT:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + 3 * chipWidth / 4 + chipWidth / 4 - chipWidth / 8, y + chipHeight / 4);
            break;
          case BOTTOM_LEFT:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + chipWidth / 4 - chipWidth / 4 + chipWidth / 8, y + chipHeight - chipHeight / 4);
            break;
          case BOTTOM:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + chipWidth / 2, y + chipHeight);
            break;
          case BOTTOM_RIGHT:
            context.moveTo(x + chipWidth / 2, y + chipHeight / 2);
            context.lineTo(x + 3 * chipWidth / 4 + chipWidth / 4 - chipWidth / 8, y + chipHeight - chipHeight / 4);
            break;
        }

        context.fill();
        context.stroke();
      }
    });
  }
}