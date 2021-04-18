import type firebase from 'firebase';
import React from 'react';
import FilterUsers from '../components/FilterUsers';
import {
  fieldClassName,
  successButtonClassName,
} from '../components/InteractivePrimitives';
import Layout from '../components/Layout';
import { Loading } from '../components/ModalDialog';
import { SourceLine, SourceSubscriptionLine } from '../components/Sources';
import { contentClassName } from '../components/UI';
import commonLocalizationStrings from '../const/commonStrings';
import type { Language } from '../lib/languages';
import { extractString } from '../lib/languages';
import {
  defaultDatabaseSources,
  localizationStrings,
  sourceSubscriptions,
} from '../lib/sources';
import type { DatabaseSource } from '../lib/sources';
import type { State } from '../lib/stateManagement';
import { generateReducer } from '../lib/stateManagement';
import type { Actions } from '../reducers/Sources';
import type { RefActions } from '../refReducers/Sources';

export type LoadingState = State<'LoadingState'>;

export type MainState = State<
  'MainState',
  {
    readonly newSourceName: string;
    readonly searchQuery: string;
    readonly promptToDeleteSource: false | string;
    readonly userSources: Record<string, DatabaseSource>;
    readonly user: firebase.User;
    readonly refObjectDispatchCurried: (action: RefActions) => void;
  }
>;

export type States = LoadingState | MainState;

type StateWithProps = States & {
  readonly props: {
    readonly dispatch: (action: Actions) => void;
  };
};

export function mainState(state: States): MainState {
  if (state.type !== 'MainState') throw new Error('Invalid state');
  return state;
}

export const stateReducer = generateReducer<JSX.Element, StateWithProps>({
  LoadingState() {
    return <Loading />;
  },
  MainState({ action: { props, ...state } }) {
    return (
      <Layout
        title={extractString(commonLocalizationStrings, 'sources')}
        privatePage
        localizationStrings={localizationStrings}
      >
        {(
          languageStrings: Readonly<typeof localizationStrings[Language]>,
          language: Language,
          commonLanguageStrings: Readonly<
            typeof commonLocalizationStrings[Language]
          >
        ): JSX.Element => (
          <FilterUsers protected>
            {(): JSX.Element => (
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
                          commonStrings={commonLanguageStrings}
                          onDelete={(): void =>
                            props.dispatch({
                              type: 'DeleteSourceAction',
                              sourceName,
                            })
                          }
                          onLabelChange={(labelColor): void =>
                            props.dispatch({
                              type: 'ChangeSourceLabelColorAction',
                              sourceName,
                              labelColor,
                            })
                          }
                          onPriorityChange={(newPriority): void =>
                            props.dispatch({
                              type: 'ChangeSourcePriorityAction',
                              sourceName,
                              priority: newPriority,
                            })
                          }
                          onRename={(newName): void =>
                            props.dispatch({
                              type: 'RenameSourceAction',
                              sourceName,
                              sourceLabel: newName,
                            })
                          }
                          onToggleSubscribe={(): void =>
                            props.dispatch({
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
                        onChange={(event): void =>
                          props.dispatch({
                            type: 'ChangeNewSourceNameAction',
                            newSourceName: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-end-6">
                      <button
                        type="button"
                        className={`${successButtonClassName} w-full`}
                        onClick={(): void =>
                          props.dispatch({
                            type: 'AddNewSourceAction',
                          })
                        }
                      >
                        {commonLanguageStrings.add}
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
                    onChange={(event): void =>
                      props.dispatch({
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
                        !Object.keys(state.userSources ?? {}).includes(
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
  },
});
