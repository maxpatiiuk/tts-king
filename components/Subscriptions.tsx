import React from 'react';

import type { Language } from '../lib/languages';
import type {
  DatabaseSource,
  localizationStrings,
  Source,
} from '../lib/sources';
import { sourceSubscriptions } from '../lib/sources';
import {
  fieldClassName,
  successButtonClassName,
} from './InteractivePrimitives';

export function AvailableSubscriptions({
  languageStrings,
  searchQuery,
  userSources,
  onChangeSearchQuery: handleChangeSearchQuery,
  onAddSubscription: handleAddSubscription,
}: {
  readonly languageStrings: typeof localizationStrings[Language];
  readonly searchQuery: string;
  readonly userSources: Readonly<Record<string, DatabaseSource>>;
  readonly onChangeSearchQuery: (searchQuery: string) => void;
  readonly onAddSubscription: (subscriptionName: string) => void;
}): JSX.Element {
  return (
    <>
      {' '}
      <div className="flex justify-between mb-3">
        <h2 className="text-xl sm:text-4xl">
          {languageStrings.availableSubscriptions}
        </h2>
        <input
          className={fieldClassName}
          placeholder={languageStrings.search}
          type="text"
          value={searchQuery}
          onChange={(event): void =>
            handleChangeSearchQuery(event.target.value)
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
              !Object.keys(userSources ?? {}).includes(sourceName) &&
              label.includes(searchQuery)
          )
          .map((source, index, list) => (
            <React.Fragment key={source[0]}>
              <SourceSubscriptionLine
                languageStrings={languageStrings}
                source={source}
                onSubscribe={handleAddSubscription.bind(undefined, source[0])}
              />
              {index + 1 < list.length && <hr className="col-span-full" />}
            </React.Fragment>
          ))}
      </div>
    </>
  );
}

function SourceSubscriptionLine({
  languageStrings,
  source: [, sourceData],
  onSubscribe: handleSubscribe,
}: {
  readonly languageStrings: typeof localizationStrings[Language];
  readonly source: Readonly<[string, Source]>;
  readonly onSubscribe: () => void;
}): JSX.Element {
  return (
    <div className="contents">
      <div>
        {sourceData.label}
        <span className="text-gray-600"> - {sourceData.description}</span>
      </div>
      <div>
        <button
          type="button"
          className={successButtonClassName}
          onClick={handleSubscribe}
        >
          {languageStrings.subscribe}
        </button>
      </div>
    </div>
  );
}
