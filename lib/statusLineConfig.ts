export const DEFAULT_STATUS_LINE_TIMEOUT = 1500;

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
