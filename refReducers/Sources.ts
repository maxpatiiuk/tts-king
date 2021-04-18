import type React from 'react';
import type { Action, State } from '../lib/stateManagement';
import { generateDispatch } from '../lib/stateManagement';
import type { Actions } from '../reducers/Sources';

type RefBaseState = State<
  'RefBaseState',
  {
    saveMessageTimeout: NodeJS.Timeout | undefined;
    showDatabaseFailureMessage: boolean;
  }
>;

export type RefStates = RefBaseState;

type RefUpdateSaveMessageAction = Action<'RefUpdateSaveMessageAction'>;

type RefShowDatabaseFailureAction = Action<'RefShowDatabaseFailureAction'>;

type RefRunAsyncTaskAction = Action<
  'RefRunAsyncTaskAction',
  {
    task: (dispatch: (action: Actions) => void) => void;
  }
>;

export type RefActions =
  | RefUpdateSaveMessageAction
  | RefShowDatabaseFailureAction
  | RefRunAsyncTaskAction;

type RefActionsWithPayload = RefActions & {
  payload: {
    refObject: React.MutableRefObject<RefStates>;
    dispatch: (action: Actions) => void;
  };
};

export const refInitialState: RefStates = {
  type: 'RefBaseState',
  saveMessageTimeout: undefined,
  showDatabaseFailureMessage: false,
} as const;

const SAVE_MESSAGE_TIMEOUT = 1000;

export const refObjectDispatch = generateDispatch<RefActionsWithPayload>({
  RefUpdateSaveMessageAction: ({ payload: { refObject } }) => {
    if (typeof refObject.current.saveMessageTimeout !== 'undefined')
      clearTimeout(refObject.current.saveMessageTimeout);

    refObject.current.saveMessageTimeout = setTimeout(() => {
      if (refObject.current.showDatabaseFailureMessage) return;

      // TODO: show success banner
      console.log('saved');
    }, SAVE_MESSAGE_TIMEOUT);
  },
  RefShowDatabaseFailureAction: ({ payload: { refObject } }) => {
    refObject.current.showDatabaseFailureMessage = true;

    // TODO: show error banner
    throw new Error('failed saving');
  },
  RefRunAsyncTaskAction: ({ task, payload: { dispatch } }) => task(dispatch),
});
