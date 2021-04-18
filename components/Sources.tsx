import React from 'react';
import type commonLocalizationStrings from '../const/commonStrings';
import type { Language } from '../lib/languages';
import type {
  DatabaseSource,
  Source,
  localizationStrings,
} from '../lib/sources';
import { sourceSubscriptions } from '../lib/sources';
import {
  dangerButtonClassName,
  fieldClassName,
  successButtonClassName,
} from './InteractivePrimitives';

const DEFAULT_SOURCE_PRIORITY = 0;

export function SourceLine({
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

export function SourceSubscriptionLine({
  languageStrings,
  source: [, sourceData],
  onSubscribe: handleSubscribe,
}: {
  readonly languageStrings: typeof localizationStrings[Language];
  readonly source: [string, Source];
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
