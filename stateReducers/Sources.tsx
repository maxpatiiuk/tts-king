import type { User } from 'firebase/auth';
import React from 'react';
import type { State } from 'typesafe-reducer';
import { generateReducer } from 'typesafe-reducer';

import FilterUsers from '../components/FilterUsers';
import Layout from '../components/Layout';
import { Loading } from '../components/ModalDialog';
import { UserSources } from '../components/Sources';
import { AvailableSubscriptions } from '../components/Subscriptions';
import { contentClassName } from '../components/UI';
import commonLocalizationStrings from '../const/commonStrings';
import type { Language } from '../lib/languages';
import { extractString } from '../lib/languages';
import type { DatabaseSource } from '../lib/sources';
import { localizationStrings } from '../lib/sources';
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
    readonly user: User;
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
                <UserSources
                  languageStrings={languageStrings}
                  commonLanguageStrings={commonLanguageStrings}
                  language={language}
                  sources={state.userSources}
                  newSourceName={state.newSourceName}
                  onDelete={(sourceName: string): void =>
                    props.dispatch({
                      type: 'DeleteSourceAction',
                      sourceName,
                    })
                  }
                  onLabelChange={(
                    sourceName: string,
                    labelColor: string
                  ): void =>
                    props.dispatch({
                      type: 'ChangeSourceLabelColorAction',
                      sourceName,
                      labelColor,
                    })
                  }
                  onPriorityChange={(sourceName, newPriority): void =>
                    props.dispatch({
                      type: 'ChangeSourcePriorityAction',
                      sourceName,
                      priority: newPriority,
                    })
                  }
                  onRename={(sourceName, newName): void =>
                    props.dispatch({
                      type: 'RenameSourceAction',
                      sourceName,
                      sourceLabel: newName,
                    })
                  }
                  onToggleSubscribe={(sourceName): void =>
                    props.dispatch({
                      type: 'ToggleSourceSubscriptionAction',
                      sourceName,
                    })
                  }
                  onNewSourceNameChange={(newSourceName): void =>
                    props.dispatch({
                      type: 'ChangeNewSourceNameAction',
                      newSourceName,
                    })
                  }
                  onNewSourceAddAction={(): void =>
                    props.dispatch({
                      type: 'AddNewSourceAction',
                    })
                  }
                />
                <AvailableSubscriptions
                  languageStrings={languageStrings}
                  searchQuery={state.searchQuery}
                  userSources={state.userSources}
                  onChangeSearchQuery={(searchQuery): void =>
                    props.dispatch({
                      type: 'ChangeSearchQueryAction',
                      searchQuery,
                    })
                  }
                  onAddSubscription={(subscriptionName): void =>
                    props.dispatch({
                      type: 'AddSubscriptionAction',
                      subscriptionName,
                    })
                  }
                />
              </div>
            )}
          </FilterUsers>
        )}
      </Layout>
    );
  },
});
