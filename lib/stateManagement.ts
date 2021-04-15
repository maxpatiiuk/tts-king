/*
 *
 * Generator of type safe-reducer and dispatches
 * Replaces the need for switch(){} statements
 * This code is based on https://github.com/maxxxxxdlp/typesafe_reducer
 *
 */

'use strict';

export type Action<
  ACTION_NAME extends string,
  ACTION_CONTENT extends Record<string, unknown> = Record<never, unknown>
> = { type: ACTION_NAME } & ACTION_CONTENT;

export type State<
  STATE_NAME extends string,
  STATE_CONTENT extends Record<string, unknown> = Record<never, unknown>
> = { type: STATE_NAME } & STATE_CONTENT;

function assertExhaustive(caseType: never): never {
  throw new Error(
    `Non-exhaustive switch. Unhandled case: ${caseType as string}`
  );
}

export const generateReducer = <STATE, ACTION extends Action<string>>(
  object: {
    [actionType in ACTION['type']]: (props: {
      readonly state: STATE;
      readonly action: Extract<ACTION, Action<actionType>>;
    }) => STATE;
  }
): ((state: STATE, key: ACTION) => STATE) => <KEY extends keyof typeof object>(
  state: STATE,
  action: Readonly<Action<KEY>>
): STATE =>
  typeof object[action.type] === 'function'
    ? object[action.type]({
        state,
        action: action as Extract<ACTION, Action<KEY>>,
      })
    : assertExhaustive(action.type as never);

export const generateDispatch = <ACTION extends Action<string>>(
  object: {
    [actionType in ACTION['type']]: (
      action: Extract<ACTION, Action<actionType>>
    ) => void;
  }
): ((key: ACTION) => void) => <KEY extends keyof typeof object>(
  action: Readonly<Action<KEY>>
): void =>
  typeof object[action.type] === 'function'
    ? object[action.type](action as Extract<ACTION, Action<KEY>>)
    : assertExhaustive(action.type as never);
