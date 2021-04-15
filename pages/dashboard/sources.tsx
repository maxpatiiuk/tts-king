import firebase from 'firebase/app';
import React from 'react';
import { AuthContext } from '../../components/AuthContext';
import FilterUsers from '../../components/FilterUsers';
import {
  dangerButtonClassName,
  fieldClassName,
  successButtonClassName,
} from '../../components/InteractivePrimitives';
import Layout from '../../components/Layout';
import { Loading } from '../../components/ModalDialog';
import { contentClassName } from '../../components/UI';
import commonLocalizationStrings from '../../const/commonStrings';
import type { Language, LocalizationStrings } from '../../lib/languages';
import { extractString } from '../../lib/languages';
import type { DatabaseSource, Source } from '../../lib/sources';
import {
  createNewCategory,
  createNewSubscription,
  defaultDatabaseSources,
  sourceSubscriptions,
} from '../../lib/sources';
import type { Action, State } from '../../lib/stateManagement';
import { generateDispatch, generateReducer } from '../../lib/stateManagement';

const localizationStrings: LocalizationStrings<{
  mySources: string;
  availableSubscriptions: string;
  subscribe: string;
  unsubscribe: string;
  priority: string;
  search: string;
  newSourceName: string;
  sourceName: string;
  controls: string;
  confirmDeleteTitle: string;
  confirmDeleteMessage: string;
  confirmDeleteSourceMessage: string;
  confirmDeleteSubscription: string;
  label: string;
}> = {
  'en-US': {
    mySources: 'My sources',
    availableSubscriptions: 'Available Subscriptions',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    priority: 'Priority',
    search: '🔍\tSearch',
    newSourceName: "New Source's Name",
    sourceName: 'Source Name',
    controls: 'Controls',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteMessage: 'Are you sure you want to delete this source?',
    confirmDeleteSourceMessage:
      'All posts belonging to this source would ' + 'be removed',
    confirmDeleteSubscription:
      'All posts added by this subscription would ' + 'be removed',
    label: 'Label',
  },
};

const DEFAULT_SOURCE_PRIORITY = 0;

function SourceLine({
  languageStrings,
  source: [sourceName, sourceData],
  commonStrings,
  onRename: handleRename,
  onLabelChange: handleLabelChange,
  onPriorityChange: handlePriorityChange,
  onToggleSubscribe: handleToggleSubscribe,
  onDelete: handleDelete,
}: {
  languageStrings: typeof localizationStrings[Language];
  source: [string, DatabaseSource];
  commonStrings: typeof commonLocalizationStrings[Language];
  onRename: (newName: string) => void;
  onLabelChange: (newColor: string) => void;
  onPriorityChange: (newPriority: number) => void;
  onToggleSubscribe: () => void;
  onDelete: () => void;
}): JSX.Element {
  // Need to extract the value to silence the Stylelint error
  const color =
    sourceData.type === 'subscription' ? undefined : sourceData.labelColor;

  return (
    <div className="contents">
      <div>
        {sourceData.type === 'subscription' ? (
          sourceSubscriptions[sourceName].label
        ) : (
          <input
            className={`w-full ${fieldClassName}`}
            type="text"
            value={sourceData.label}
            onChange={(event) => handleRename(event.target.value)}
          />
        )}
      </div>
      {sourceData.type === 'subscription' ? (
        // TODO: display subscription image here
        <img src={''} alt="TODO: add image" className="block h-full w-auto" />
      ) : (
        <div className="relative">
          <div className="absolute bottom-0 left-0 h-full">
            <img
              src={
                'data:image/svg+xml,%3Csvg ' +
                'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"/%3E'
              }
              alt=""
              className="block h-full w-auto"
            />
            <label>
              <span
                className="absolute inset-0 h-full w-auto rounded-full"
                style={{
                  backgroundColor: color,
                }}
              />
              <input
                className={`sr-only`}
                type="color"
                value={sourceData.labelColor}
                onChange={(event) => handleLabelChange(event.target.value)}
              />
            </label>
          </div>
        </div>
      )}
      <input
        className={`${fieldClassName} w-full`}
        type="number"
        min={0}
        value={sourceData.priority}
        onChange={(event) =>
          handlePriorityChange(
            Number.parseInt(event.target.value) || DEFAULT_SOURCE_PRIORITY
          )
        }
      />
      <div>
        {'subscribed' in sourceData && (
          <button
            className={`${
              sourceData.subscribed
                ? dangerButtonClassName
                : successButtonClassName
            } w-full`}
            onClick={handleToggleSubscribe}
          >
            {sourceData.subscribed
              ? languageStrings.unsubscribe
              : languageStrings.subscribe}
          </button>
        )}
      </div>
      <button
        className={`${dangerButtonClassName} w-full`}
        onClick={handleDelete}
      >
        {commonStrings.delete}
      </button>
    </div>
  );
}

function SourceSubscriptionLine({
  languageStrings,
  source: [, sourceData],
  onSubscribe: handleSubscribe,
}: {
  languageStrings: typeof localizationStrings[Language];
  source: [string, Source];
  onSubscribe: () => void;
}) {
  return (
    <div className="contents">
      <div>
        {sourceData.label}
        <span className="text-gray-600"> - {sourceData.description}</span>
      </div>
      <div>
        <button className={successButtonClassName} onClick={handleSubscribe}>
          {languageStrings.subscribe}
        </button>
      </div>
    </div>
  );
}

type LoadingState = State<'LoadingState'>;

type MainState = State<
  'MainState',
  {
    newSourceName: string;
    searchQuery: string;
    promptToDeleteSource: false | string;
    userSources: Record<string, DatabaseSource>;
    user: firebase.User;
    refObjectDispatchCurried: (action: ReferenceActions) => void;
  }
>;

type States = LoadingState | MainState;

type LoadedAction = Action<
  'LoadedAction',
  {
    userSources: Record<string, DatabaseSource>;
    user: firebase.User;
    refObjectDispatchCurried: (action: ReferenceActions) => void;
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

type Actions =
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

function mainState(state: States): MainState {
  if (state.type !== 'MainState') throw new Error('Invalid state');
  return state;
}

const reducer = generateReducer<States, Actions>({
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
  AddNewSourceAction: ({ state: initialState }) => {
    const state = mainState(initialState);

    const newCategory: DatabaseSource = createNewCategory(state.newSourceName);

    state.refObjectDispatchCurried({
      type: 'RefRunAsyncTaskAction',
      task: async (dispatch) =>
        firebase
          .database()
          .ref(`users/${state.user.uid}/sourcesMeta`)
          .push(newCategory)
          .then((snapshot) => {
            dispatch({
              type: 'AddSourceLineAction',
              key: snapshot.key!,
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
  RenameSourceAction: ({ action, state }) => ({
    ...mainState(state),
  }),
  ChangeSourceLabelColorAction: ({ action, state }) => ({
    ...mainState(state),
  }),
  ChangeSourcePriorityAction: ({ action, state }) => ({
    ...mainState(state),
  }),
  ToggleSourceSubscriptionAction: ({ action, state }) => ({
    ...mainState(state),
    userSources: {
      ...mainState(state).userSources,
      [action.sourceName]: {
        ...mainState(state).userSources[action.sourceName],
        // @ts-expect-error
        subscribed: !mainState(state).userSources[action.sourceName].subscribed,
      },
    },
  }),
  DeleteSourceAction: ({ action, state }) => ({
    ...mainState(state),
    promptToDeleteSource: action.sourceName,
  }),
  ConfirmDeleteSourceAction: ({ action, state }) => ({
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

type ReferenceBaseState = State<
  'RefBaseState',
  {
    saveMessageTimeout: NodeJS.Timeout | undefined;
    showDatabaseFailureMessage: boolean;
  }
>;

type ReferenceStates = ReferenceBaseState;

type ReferenceUpdateSaveMessageAction = Action<'RefUpdateSaveMessageAction'>;

type ReferenceShowDatabaseFailureAction = Action<'RefShowDatabaseFailureAction'>;

type ReferenceRunAsyncTaskAction = Action<
  'RefRunAsyncTaskAction',
  {
    task: (dispatch: (action: Actions) => void) => void;
  }
>;

type ReferenceActions =
  | ReferenceUpdateSaveMessageAction
  | ReferenceShowDatabaseFailureAction
  | ReferenceRunAsyncTaskAction;

type ReferenceActionsWithPayload = ReferenceActions & {
  payload: {
    refObject: React.MutableRefObject<ReferenceStates>;
    dispatch: (action: Actions) => void;
  };
};

const referenceInitialState: ReferenceStates = {
  type: 'RefBaseState',
  saveMessageTimeout: undefined,
  showDatabaseFailureMessage: false,
} as const;

const SAVE_MESSAGE_TIMEOUT = 1000;

const referenceObjectDispatch = generateDispatch<ReferenceActionsWithPayload>({
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

export default function Sources() {
  const { user } = React.useContext(AuthContext);
  const referenceObject = React.useRef<ReferenceStates>(referenceInitialState);

  const [state, dispatch] = React.useReducer(reducer, {
    type: 'LoadingState',
  });

  const referenceObjectDispatchCurried = (action: ReferenceActions) =>
    referenceObjectDispatch({
      ...action,
      payload: {
        refObject: referenceObject,
        dispatch,
      },
    });

  React.useEffect(() => {
    if (!user || state.type !== 'LoadingState') return;

    firebase
      .app()
      .database()
      .ref(`users/${user.uid}/sourcesMeta`)
      .on('value', (value) => {
        dispatch({
          type: 'LoadedAction',
          userSources: (value.val() as Record<never, unknown>) || {},
          user,
          refObjectDispatchCurried: referenceObjectDispatchCurried,
        });
      });
  }, [user, state.type]);

  if (state.type === 'LoadingState') return <Loading />;

  return (
    <Layout
      title={extractString(commonLocalizationStrings, 'sources')}
      privatePage
      localizationStrings={localizationStrings}
    >
      {(languageStrings, language, commonStrings) => (
        <FilterUsers isProtected={true} redirectPath={'/signIn'}>
          {() => (
            <div className={contentClassName}>
              <h2 className="text-xl sm:text-4xl mb-3">
                {languageStrings.mySources}
              </h2>
              <div
                className="grid gap-3 mb-10"
                style={{
                  gridTemplateColumns: 'auto repeat(4, min-content)',
                }}
              >
                <div className="contents text-2xl">
                  <div>{languageStrings.sourceName}</div>
                  <div>{languageStrings.label}</div>
                  <div>{languageStrings.priority}</div>
                  <div className="col-span-2">{languageStrings.controls}</div>
                </div>
                <hr className="col-span-full" />
                {Object.entries({
                  ...state.userSources,
                  ...defaultDatabaseSources(language),
                } as Record<string, DatabaseSource>)
                  .sort(
                    (
                      [, { priority: priorityLeft }],
                      [, { priority: priorityRight }]
                    ) =>
                      Number(priorityLeft) === Number(priorityRight)
                        ? 0
                        : Number(priorityLeft) === Number(priorityRight)
                        ? -1
                        : 1
                  )
                  .map(([sourceName, sourceData]) => (
                    <React.Fragment key={sourceName}>
                      <SourceLine
                        languageStrings={languageStrings}
                        source={[sourceName, sourceData]}
                        commonStrings={commonStrings}
                        onDelete={() =>
                          dispatch({
                            type: 'DeleteSourceAction',
                            sourceName,
                          })
                        }
                        onLabelChange={(labelColor) =>
                          dispatch({
                            type: 'ChangeSourceLabelColorAction',
                            sourceName,
                            labelColor,
                          })
                        }
                        onPriorityChange={(newPriority) =>
                          dispatch({
                            type: 'ChangeSourcePriorityAction',
                            sourceName,
                            priority: newPriority,
                          })
                        }
                        onRename={(newName) =>
                          dispatch({
                            type: 'RenameSourceAction',
                            sourceName,
                            sourceLabel: newName,
                          })
                        }
                        onToggleSubscribe={() =>
                          dispatch({
                            type: 'ToggleSourceSubscriptionAction',
                            sourceName,
                          })
                        }
                      />
                      <hr className="col-span-full" />
                    </React.Fragment>
                  ))}
                <div className="contents">
                  <div>
                    <input
                      className={`${fieldClassName} w-full`}
                      placeholder={languageStrings.newSourceName}
                      type="text"
                      value={state.newSourceName}
                      onChange={(event) =>
                        dispatch({
                          type: 'ChangeNewSourceNameAction',
                          newSourceName: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-end-6">
                    <button
                      className={`${successButtonClassName} w-full`}
                      onClick={() =>
                        dispatch({
                          type: 'AddNewSourceAction',
                        })
                      }
                    >
                      {commonStrings.add}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mb-3">
                <h2 className="text-xl sm:text-4xl">
                  {languageStrings.availableSubscriptions}
                </h2>
                <input
                  className={fieldClassName}
                  placeholder={languageStrings.search}
                  type="text"
                  value={state.searchQuery}
                  onChange={(event) =>
                    dispatch({
                      type: 'ChangeSearchQueryAction',
                      searchQuery: event.target.value,
                    })
                  }
                />
              </div>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: '1fr min-content',
                }}
              >
                {Object.entries(sourceSubscriptions)
                  .filter(
                    ([sourceName, { label }]) =>
                      !Object.keys(state.userSources || {}).includes(
                        sourceName
                      ) && label.includes(state.searchQuery)
                  )
                  .map((source, index, list) => (
                    <React.Fragment key={source[0]}>
                      <SourceSubscriptionLine
                        languageStrings={languageStrings}
                        source={source}
                      />
                      {index + 1 < list.length && (
                        <hr className="col-span-full" />
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          )}
        </FilterUsers>
      )}
    </Layout>
  );
}
