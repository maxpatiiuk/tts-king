export const DEFAULT_STATUS_LINE_TIMEOUT = 1500;

/*
 * If updating this value, should also update the className in
 * components/StatusLine.tsx
 */
export const STATUS_LINE_ANIMATION_DURATION = 100;

export interface StatusLineStatus {
  // The element to be displayed
  readonly message: JSX.Element | string;
  /*
   * Used to make sure the same message type is not shown multiple times.
   * Can be set to an empty string if you want to allow pushing the same
   * message to the stack multiple times
   */
  readonly id: string;
}

export const statusLineContentClassName = 'p-5';
