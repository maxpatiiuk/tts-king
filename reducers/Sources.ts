import type { User } from 'firebase/auth';
import { ref, push } from 'firebase/database';
import { safe } from '../lib/typescriptCommonTypes';
import { FirebaseObject } from '../lib/userUtils';
import type { RefActions } from '../refReducers/Sources';
import type { DatabaseSource, DatabaseSubscription } from '../lib/sources';
import { createNewCategory, createNewSubscription } from '../lib/sources';
import type { Action } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';
import type { States } from '../stateReducers/Sources';
import { mainState } from '../stateReducers/Sources';

type LoadedAction = Action<
  'LoadedAction',
  {
    userSources: Record<string, DatabaseSource>;
    user: User;
    refObjectDispatchCurried: (action: RefActions) => void;
  }
>;

type ChangeSearchQueryAction = Action<
  'ChangeSearchQueryAction',
  {
    searchQuery: string;
  }
>;

type ChangeNewSourceNameAction = Action<
  'ChangeNewSourceNameAction',
  {
    newSourceName: string;
  }
>;

type AddNewSourceAction = Action<'AddNewSourceAction'>;

type RenameSourceAction = Action<
  'RenameSourceAction',
  {
    sourceName: string;
    sourceLabel: string;
  }
>;

type ChangeSourceLabelColorAction = Action<
  'ChangeSourceLabelColorAction',
  {
    sourceName: string;
    labelColor: string;
  }
>;

type ChangeSourcePriorityAction = Action<
  'ChangeSourcePriorityAction',
  {
    sourceName: string;
    priority: number;
  }
>;

type ToggleSourceSubscriptionAction = Action<
  'ToggleSourceSubscriptionAction',
  {
    sourceName: string;
  }
>;

type DeleteSourceAction = Action<
  'DeleteSourceAction',
  {
    sourceName: string;
  }
>;

type ConfirmDeleteSourceAction = Action<'ConfirmDeleteSourceAction'>;

type CancelDeleteSourceAction = Action<'CancelDeleteSourceAction'>;

type AddSubscriptionAction = Action<
  'AddSubscriptionAction',
  {
    subscriptionName: string;
  }
>;

type AddSourceLineAction = Action<
  'AddSourceLineAction',
  {
    sourceLine: DatabaseSource;
    key: string;
  }
>;

export type Actions =
  | LoadedAction
  | ChangeSearchQueryAction
  | ChangeNewSourceNameAction
  | AddNewSourceAction
  | AddSourceLineAction
  | RenameSourceAction
  | ChangeSourceLabelColorAction
  | ChangeSourcePriorityAction
  | ToggleSourceSubscriptionAction
  | DeleteSourceAction
  | ConfirmDeleteSourceAction
  | CancelDeleteSourceAction
  | AddSubscriptionAction;

export type ActionWithPayload = Actions & {
  readonly payload: {
    readonly firebase: FirebaseObject;
    readonly user: User;
  };
};

export const reducer = generateReducer<States, ActionWithPayload>({
  LoadedAction: ({ action }) => ({
    type: 'MainState',
    newSourceName: '',
    searchQuery: '',
    userSources: action.userSources,
    promptToDeleteSource: false,
    user: action.user,
    refObjectDispatchCurried: action.refObjectDispatchCurried,
  }),
  ChangeSearchQueryAction: ({ action, state }) => ({
    ...mainState(state),
    searchQuery: action.searchQuery,
  }),
  ChangeNewSourceNameAction: ({ action, state }) => ({
    ...mainState(state),
    newSourceName: action.newSourceName,
  }),
  AddNewSourceAction: ({
    state: initialState,
    action: {
      payload: { firebase },
    },
  }) => {
    const state = mainState(initialState);

    const newCategory: DatabaseSource = createNewCategory(state.newSourceName);

    state.refObjectDispatchCurried({
      type: 'RefRunAsyncTaskAction',
      task: async (dispatch) =>
        push(
          ref(
            safe(firebase.firebaseDatabase),
            `users/${state.user.uid}/sourcesMeta`
          )
        )
          .then((snapshot) => {
            dispatch({
              type: 'AddSourceLineAction',
              key: snapshot.key ?? '',
              sourceLine: newCategory,
            });
            state.refObjectDispatchCurried({
              type: 'RefUpdateSaveMessageAction',
            });
          })
          .catch(() =>
            state.refObjectDispatchCurried({
              type: 'RefShowDatabaseFailureAction',
            })
          ),
    });

    return {
      ...state,
      newSourceName: '',
    };
  },
  AddSourceLineAction: ({ action, state }) => ({
    ...mainState(state),
    userSources: {
      ...mainState(state).userSources,
      [action.key]: action.sourceLine,
    },
  }),
  RenameSourceAction: ({ state }) => ({
    ...mainState(state),
  }),
  ChangeSourceLabelColorAction: ({ state }) => ({
    ...mainState(state),
  }),
  ChangeSourcePriorityAction: ({ state }) => ({
    ...mainState(state),
  }),
  ToggleSourceSubscriptionAction: ({ action, state }) => ({
    ...mainState(state),
    userSources: {
      ...mainState(state).userSources,
      [action.sourceName]: {
        ...mainState(state).userSources[action.sourceName],
        subscribed: !(
          mainState(state).userSources[
            action.sourceName
          ] as DatabaseSubscription
        ).subscribed,
      },
    },
  }),
  DeleteSourceAction: ({ action, state }) => ({
    ...mainState(state),
    promptToDeleteSource: action.sourceName,
  }),
  ConfirmDeleteSourceAction: ({ state }) => ({
    ...mainState(state),
  }),
  CancelDeleteSourceAction: ({ state }) => ({
    ...mainState(state),
    promptToDeleteSource: false,
  }),
  AddSubscriptionAction: ({ action, state }) => {
    const newSubscription = createNewSubscription();

    /*
     * TODO: finish this
     *  firebase.database().ref(
     *    `users/${state.user.uid}`,
     *  ).set(newSubscription).then(() =>
     *    state.refObjectDispatchCurried({
     *      type: 'RefUpdateSaveMessageAction',
     *    }),
     *  ).catch(() =>
     *    state.refObjectDispatchCurried({
     *      type: 'RefShowDatabaseFailureAction',
     *    }),
     *  );
     */

    return {
      ...mainState(state),
      userSources: {
        ...mainState(state).userSources,
        [action.subscriptionName]: newSubscription,
      },
    };
  },
});
