import React                     from 'react';
import Layout                    from '../../components/Layout';
import FilterUsers               from '../../components/FilterUsers';
import { contentClassName }               from '../../components/UI';
import {
  extractString,
  Language,
  LocalizationStrings,
} from '../../lib/languages';
import {
  dangerButtonClassName,
  fieldClassName,
  successButtonClassName,
}                                from '../../components/InteractivePrimitives';
import {
  DatabaseSource,
  defaultDatabaseSources,
  Source,
  sourceSubscriptions,
}                                from '../../lib/sources';
import {
  Action, generateReducer,
  State,
}                                from '../../lib/stateManagement';
import commonLocalizationStrings from '../../const/commonStrings';
import { AuthContext }           from '../../components/AuthContext';
import firebase                  from "firebase/app";
import { Loading }               from '../../components/ModalDialog';

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
  confirmDeleteSourceMessage: string,
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
    confirmDeleteSourceMessage: 'All posts belonging to this source would ' +
      'be removed',
    confirmDeleteSubscription: 'All posts added by this subscription would ' +
      'be removed',
    label: 'Label',
  },
};


function SourceLine({
  languageStrings,
  source: [sourceName, sourceData],
  commonStrings,
}: {
  languageStrings: typeof localizationStrings[Language],
  source: [string, DatabaseSource],
  commonStrings: typeof commonLocalizationStrings[Language]
}) {
  return <div className='contents'>
    <div>{
      sourceData.type === 'subscription' ?
        sourceSubscriptions[sourceName]?.label :
        <input
          className={`w-full ${fieldClassName}`}
          type='text'
          value={sourceData.label}
          onChange={() => alert('Renamed')}
        />
    }</div>
    <div className='relative'>
      <div className='absolute bottom-0 left-0 h-full'>
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
              backgroundColor: sourceData.label_color,
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
      onChange={() => alert('Are you sure?')}
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
    <div>
      {sourceData.label}
      <span className='text-gray-600'> - {sourceData.description}</span>
    </div>
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

type LoadingState = State<'LoadingState'>;

type MainState = State<'MainState',{
  newSourceName: string,
  searchQuery: string,
  userSources: Record<string, DatabaseSource>
}>

type SourcesStates = LoadingState| MainState;

type LoadedAction = Action<'LoadedAction', {
  userSources: Record<string, DatabaseSource>
}>;

type ChangeSearchQueryAction = Action<'ChangeSearchQueryAction', {
  searchQuery: string,
}>

type ChangeNewSourceNameAction = Action<'ChangeNewSourceNameAction',{
  newSourceName: string,
}>

type AddNewSourceAction = Action<'AddNewSourceAction'>;

type RenameSourceAction = Action<'RenameSourceAction',{
  sourceName: string,
  sourceLabel: string,
}>

type ToggleSourceSubscriptionAction = Action<'ToggleSourceSubscriptionAction',{
  sourceName: string,
  subscribed: boolean,
}>

type DeleteSourceAction = Action<'DeleteSourceAction', {
  sourceName: string,
}>

type ConfirmDeleteSourceAction = Action<'ConfirmDeleteSourceAction'>;

type CancelDeleteSourceAction = Action<'CancelDeleteSourceAction'>;

type SourcesActions =
  LoadedAction
  | ChangeSearchQueryAction
  | ChangeNewSourceNameAction
  | AddNewSourceAction
  | RenameSourceAction
  | ToggleSourceSubscriptionAction
  | DeleteSourceAction
  | ConfirmDeleteSourceAction
  | CancelDeleteSourceAction;

const reducer = generateReducer<SourcesStates,SourcesActions>({

});

export default function sources() {

  const {user} = React.useContext(AuthContext);

  const [state, dispatch] = React.useReducer(
    reducer,
    {
      type: 'LoadingState',
    },
  );

  React.useEffect(()=>{

    if(!user || state.type !== 'LoadingState')
      return;

    firebase.app().database().ref(
      `users/${user.uid}/sources_meta`
    ).on('value',(value)=>{
      dispatch({
        type: 'LoadedAction',
        userSources: value.val()
      });
    })

  },[user, state.type]);


  if(state.type === 'LoadingState')
    return <Loading />;

  return <Layout
    title={extractString(commonLocalizationStrings,'sources')}
    privatePage
    localizationStrings={localizationStrings}
  >{
    (languageStrings, language, commonStrings) => <FilterUsers
      isProtected={true}
      redirectPath={'/sign_in'}
    >{
      () => <div className={contentClassName}>
        <h2 className='text-4xl mb-3'>{languageStrings.mySources}</h2>
        <div
          className='grid gap-3 mb-10'
          style={{
            gridTemplateColumns: 'auto repeat(5, min-content)',
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
              state.userSources ||
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
            gridTemplateColumns: '1fr min-content',
          }}
        >
          {Object.entries(
            sourceSubscriptions,
          ).filter(([sourceName]) =>
            Object.keys(
              state.userSources || {},
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
      </div>
    }</FilterUsers>
  }</Layout>;
}
