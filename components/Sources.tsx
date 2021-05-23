import React from 'react';

import type commonLocalizationStrings from '../const/commonStrings';
import type { Language } from '../lib/languages';
import type { DatabaseSource, localizationStrings } from '../lib/sources';
import { defaultDatabaseSources, sourceSubscriptions } from '../lib/sources';
import {
  dangerButtonClassName,
  fieldClassName,
  successButtonClassName,
} from './InteractivePrimitives';

const DEFAULT_SOURCE_PRIORITY = 0;

export function UserSources({
  languageStrings,
  commonLanguageStrings,
  language,
  sources,
  newSourceName,
  onDelete: handleDelete,
  onLabelChange: handleLabelChange,
  onPriorityChange: handlePriorityChange,
  onRename: handleRename,
  onToggleSubscribe: handleToggleSubscribe,
  onNewSourceNameChange: handleNewSourceNameChange,
  onNewSourceAddAction: handleNewSourceAddAction,
}: {
  readonly languageStrings: typeof localizationStrings[Language];
  readonly commonLanguageStrings: typeof commonLocalizationStrings[Language];
  readonly language: Language;
  readonly sources: Readonly<Record<string, DatabaseSource>>;
  readonly newSourceName: string;
  readonly onDelete: (sourceName: string) => void;
  readonly onLabelChange: (sourceName: string, labelColor: string) => void;
  readonly onPriorityChange: (sourceName: string, newPriority: number) => void;
  readonly onRename: (sourceName: string, newName: string) => void;
  readonly onToggleSubscribe: (sourceName: string) => void;
  readonly onNewSourceNameChange: (newSourceName: string) => void;
  readonly onNewSourceAddAction: () => void;
}): JSX.Element {
  return (
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
        ...sources,
        ...defaultDatabaseSources(language),
      } as Record<string, DatabaseSource>)
        .sort(
          ([, { priority: priorityLeft }], [, { priority: priorityRight }]) =>
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
              onDelete={handleDelete.bind(undefined, sourceName)}
              onLabelChange={handleLabelChange.bind(undefined, sourceName)}
              onPriorityChange={handlePriorityChange.bind(
                undefined,
                sourceName
              )}
              onRename={handleRename.bind(undefined, sourceName)}
              onToggleSubscribe={handleToggleSubscribe.bind(
                undefined,
                sourceName
              )}
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
            value={newSourceName}
            onChange={(event): void =>
              handleNewSourceNameChange(event.target.value)
            }
          />
        </div>
        <div className="col-end-6">
          <button
            type="button"
            className={`${successButtonClassName} w-full`}
            onClick={handleNewSourceAddAction}
          >
            {commonLanguageStrings.add}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  readonly languageStrings: typeof localizationStrings[Language];
  readonly source: Readonly<[string, DatabaseSource]>;
  readonly commonStrings: typeof commonLocalizationStrings[Language];
  readonly onRename: (newName: string) => void;
  readonly onLabelChange: (newColor: string) => void;
  readonly onPriorityChange: (newPriority: number) => void;
  readonly onToggleSubscribe: () => void;
  readonly onDelete: () => void;
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
            onChange={(event): void => handleRename(event.target.value)}
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
                onChange={(event): void =>
                  handleLabelChange(event.target.value)
                }
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
        onChange={(event): void =>
          handlePriorityChange(
            Number.parseInt(event.target.value) || DEFAULT_SOURCE_PRIORITY
          )
        }
      />
      <div>
        {'subscribed' in sourceData && (
          <button
            type="button"
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
        type="button"
        className={`${dangerButtonClassName} w-full`}
        onClick={handleDelete}
      >
        {commonStrings.delete}
      </button>
    </div>
  );
}
