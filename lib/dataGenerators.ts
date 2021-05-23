const HEX_BASE = 16;
const HEX_COLOR_LENGTH = 6;
const MIN_HEX = 0xff_ff_ff;

export const getRandomColor = (): string =>
  `#${Math.trunc(Math.random() * MIN_HEX)
    .toString(HEX_BASE)
    .padStart(HEX_COLOR_LENGTH, '0')}`;
