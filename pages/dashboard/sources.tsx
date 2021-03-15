import React                    from 'react';
import Layout                   from '../../components/Layout';
import FilterUsers              from '../../components/FilterUsers';
import { Content }              from '../../components/UI';
import {
  Language,
  LocalizationStrings,
}                               from '../../lib/languages';
import {
  dangerButtonClassName,
  fieldClassName,
  successButtonClassName,
}                                from '../../components/InteractivePrimitives';
import { FirebaseDatabaseNode }  from '@react-firebase/database';
import {
  DatabaseSource,
  defaultDatabaseSources,
  Source,
  sourceSubscriptions,
}                                from '../../lib/sources';
import { State }                 from '../../lib/stateManagement';
import commonLocalizationStrings from '../../const/commonStrings';

const localizationStrings: LocalizationStrings<{
  mySources: string,
  availableSubscriptions: string,
  subscribe: string,
  unsubscribe: string,
  priority: string,
  search: string,
  newSourceName: string,
  sourceName: string
  controls: string
  confirmDeleteTitle: string,
  confirmDeleteMessage: string,
  confirmDeleteCategoryMessage: string,
  confirmDeleteSubscription: string,
  label: string,
}> = {
  'en-US': {
    mySources: 'My sources',
    availableSubscriptions: 'Available Subscriptions',
    subscribe: 'Subscribe',
    unsubscribe: 'Unsubscribe',
    priority: 'Priority',
    search: '🔍\tSearch',
    newSourceName: 'New Source\'s Name',
    sourceName: 'Source Name',
    controls: 'Controls',
    confirmDeleteTitle: 'Confirm Deletion',
    confirmDeleteMessage: 'Are you sure you want to delete this source?',
    confirmDeleteCategoryMessage: 'All posts belonging to this source would ' +
      'be removed',
    confirmDeleteSubscription: 'All posts added by this subscription would ' +
      'be removed',
    label: 'Label',
  },
};


function SourceLine({
  languageStrings,
  source: [sourceName, sourceData],
  commonStrings
}: {
  languageStrings: typeof localizationStrings[Language],
  source: [string, DatabaseSource],
  commonStrings: typeof commonLocalizationStrings[Language]
}) {
  return <div className='contents'>
    <div>{
      sourceSubscriptions[sourceName]?.label ||
      <input
        className={`w-full ${fieldClassName}`}
        type='text'
        value={sourceName}
        onChange={() => alert('Renamed')}
      />
    }</div>
    <div className='relative'>
      <div className='absolute bottom-0 h-full left-0'>
        <img
          src={'data:image/svg+xml,%3Csvg ' +
          'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"/%3E'}
          alt=''
          className='block h-full w-auto'
        />
        <label>
          <span
            className='absolute inset-0 h-full w-auto rounded-full'
            style={{
              backgroundColor: sourceData.label_color
            }}
          />
          <input
            className={`sr-only`}
            type='color'
            value={sourceData.label_color}
            onChange={() => alert('Color changed')}
          />
        </label>
      </div>
    </div>
    <input
      className={`${fieldClassName} w-full`}
      type='number'
      min={0}
      value={sourceData.priority}
      onChange={() => alert('Priority Changed')}
    />
    <div>{
      'subscribed' in sourceData &&
      (
        sourceData.subscribed ?
          <button
            className={`${dangerButtonClassName} w-full`}
            onClick={() =>
              alert('Unsubscribed')
            }
          >{
            languageStrings.unsubscribe
          }</button> :
          <button
            className={`${successButtonClassName} w-full`}
            onClick={() =>
              alert('Subscribed')
            }
          >{
            languageStrings.subscribe
          }</button>
      )
    }</div>
    <button
      className={`${dangerButtonClassName} w-full`}
      onChange={()=>alert('Are you sure?')}
    >{
      commonStrings.delete
    }</button>
  </div>;
}

function SourceSubscriptionLine({
  languageStrings,
  source: [, sourceData],
}: {
  languageStrings: typeof localizationStrings[Language],
  source: [string, Source],
}) {
  return <div className='contents'>
    <div>{sourceData.label}</div>
    <div className='text-gray-600'>{sourceData.description}</div>
    <div>
      <button
        className={successButtonClassName}
        onClick={() =>
          alert('Subscribed')
        }
      >{
        languageStrings.subscribe
      }</button>
    </div>
  </div>;
}

interface SourcesStates extends State<'State'> {
  newCategoryName: string,
  userSources: Record<string, DatabaseSource>
}

export default function sources() {
  return <Layout
    privatePage
    localizationStrings={localizationStrings}
  >{
    (languageStrings, language, commonStrings) => <FilterUsers
      isProtected={true}
      redirectPath={'/sign_in'}
    >{
      ({user}) => <Content>
        <FirebaseDatabaseNode
          path={`users/${user.uid}/sources_meta`}
        >{
          data => <>
            <h2 className='text-4xl mb-3'>{languageStrings.mySources}</h2>
            <div
              className='grid gap-3 mb-10'
              style={{
                gridTemplateColumns: 'auto repeat(5, min-content)'
              }}
            >
              <div className='contents text-2xl'>
                <div>{languageStrings.sourceName}</div>
                <div>{languageStrings.label}</div>
                <div>{languageStrings.priority}</div>
                <div className='col-span-2'>{languageStrings.controls}</div>
              </div>
              <hr className='col-span-full' />
              {Object.entries(
                (
                  data.value ||
                  defaultDatabaseSources(language)
                ) as Record<string, DatabaseSource>,
              ).sort((
                [, {
                  priority: priorityLeft,
                }],
                [, {
                  priority: priorityRight,
                }],
                ) =>
                  Number(priorityLeft) ===
                  Number(priorityRight) ?
                    0 :
                    Number(priorityLeft) ===
                    Number(priorityRight) ?
                      -1 :
                      1,
              ).map((source, index) => <>
                <SourceLine
                  key={source[0]}
                  languageStrings={languageStrings}
                  source={source}
                  commonStrings={commonStrings}
                />
                <hr className='col-span-full' key={index} />
              </>)}
              <div className='contents'>
                <div>
                  <input
                    className={`${fieldClassName} w-full`}
                    placeholder={
                      languageStrings.newSourceName
                    }
                    type='text'
                    value=''
                    onChange={() =>
                      alert('Changed')
                    }
                  />
                </div>
                <div className='col-end-6'>
                  <button
                    className={`${successButtonClassName} w-full`}
                    onClick={() => alert('Added')}
                  >{
                    commonStrings.add
                  }</button>
                </div>
              </div>
            </div>
            <div className='flex justify-between mb-3'>
              <h2 className='text-4xl'>
                {languageStrings.availableSubscriptions}
              </h2>
              <input
                className={fieldClassName}
                placeholder={
                  languageStrings.search
                }
                type="text"
                value=''
                onChange={() => alert('Searching')}
              />
            </div>
            <div
              className='grid gap-3'
              style={{
                gridTemplateColumns: 'auto 1fr auto'
              }}
            >
              {Object.entries(
                sourceSubscriptions,
              ).filter(([sourceName]) =>
                Object.keys(
                  data.value || {},
                ).indexOf(sourceName) === -1,
              ).map((source, index, list) => <>
                <SourceSubscriptionLine
                  key={source[0]}
                  languageStrings={languageStrings}
                  source={source}
                />
                {
                  index + 1 < list.length &&
                  <hr className='col-span-full' key={index} />
                }
              </>)
              }
            </div>
          </>
        }</FirebaseDatabaseNode>

      </Content>
    }</FilterUsers>
  }</Layout>;
}
