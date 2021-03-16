import React                     from 'react';
import Layout                    from '../../components/Layout';
import FilterUsers               from '../../components/FilterUsers';
import { contentClassName }      from '../../components/UI';
import {
  Loading,
  ModalDialog,
}                                from '../../components/ModalDialog';
import Image                     from 'next/image';
import { useRouter }             from 'next/router';
import {
  extractString,
  Language,
  LocalizationStrings,
}                                from '../../lib/languages';
import {
  dangerButtonClassName,
  dangerLinkClassName,
  LabeledField,
  primaryButtonClassName,
  successButtonClassName,
}                                from '../../components/InteractivePrimitives';
import firebase                  from 'firebase/app';
import commonLocalizationStrings from '../../const/commonStrings';

const localizationStrings: LocalizationStrings<{
  downloadData: string,
  deleteAccountConfirmationTitle: string,
  deleteAccountConfirmation: string,
  deleteAccountConsequences: string,
  downloadAndDeleteAccount: string,
  noSavedData: string,
  deleteAccount: string,
}> = {
  'en-US': {
    downloadData: 'Download my data',

    deleteAccountConfirmationTitle: 'Delete account?',
    deleteAccountConfirmation: `Are you sure you want to delete your
      account?`,
    deleteAccountConsequences: `You listening stats and saved stories
      would be permanently deleted.`,
    downloadAndDeleteAccount: 'Download my data and delete',
    noSavedData: 'We don\'t have any saved data on you',
    deleteAccount: 'Delete account',
  },
};


function downloadFile({
  data,
  fileName,
}: {
  data: string,
  fileName: string,
}) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(data),
  );
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default function profile() {

  const [
    isLoading,
    setIsLoading,
  ] = React.useState<boolean>(false);
  const [
    showDeleteUserPrompt,
    setShowDeleteUserPrompt,
  ] = React.useState<boolean>(false);
  const [
    currentUser,
    setCurrentUser,
  ] = React.useState<firebase.UserInfo | false>(false);
  const [
    currentLanguage,
    setCurrentLanguage,
  ] = React.useState<Language | false>(false);


  const router = useRouter();

  async function signOut() {
    await router.push('/');
    await firebase.auth().signOut();
  }

  async function deleteUserAccount(changeState: boolean = false) {

    if (!currentUser)
      return;

    if (changeState)
      setIsLoading(true);

    await firebase.database().ref(
      `users/${currentUser.uid}`,
    ).set(null);

    await signOut();
  }

  async function downloadUserData(callback?: (() => void)) {

    if (!currentUser || !currentLanguage)
      return;

    setIsLoading(true);

    firebase.database().ref(`users/${currentUser.uid}`).on(
      'value',
      (value) => {

        downloadFile({
          data: value.val() ||
            localizationStrings[currentLanguage].noSavedData,
          fileName: `${currentUser.uid}.json`,
        });

        if (callback)
          callback();
      },
    );
  }

  return <Layout
    privatePage
    title={extractString(commonLocalizationStrings, 'profile')}
    localizationStrings={localizationStrings}
  >{
    (languageStrings, language, commonStrings) => <>

      {!currentLanguage && setCurrentLanguage(language)}
      {isLoading && <Loading />}

      <FilterUsers
        isProtected={true}
        redirectPath={'/sign_in'}
      >{
        ({user}) => <div className={`${contentClassName} flex-col`}>

          {!currentUser && setCurrentUser(user)}

          <div className='flex justify-center'>
            <Image
              className='rounded-full'
              src={user.photoURL}
              alt={user.displayName}
              width={96}
              height={96}
            />
          </div>

          <LabeledField label='Name'>
            {user.displayName}
          </LabeledField>

          <LabeledField label='Email'>
            {user.email}
          </LabeledField>

          <button
            className={`${dangerLinkClassName} block mt-4`}
            onClick={() => downloadUserData(() => setIsLoading(false))}
          >{
            languageStrings.downloadData
          }</button>

          {
            showDeleteUserPrompt &&
            <ModalDialog
              title={
                languageStrings.deleteAccountConfirmationTitle
              }
              buttons={<>
                <button
                  className={primaryButtonClassName}
                  onClick={() =>
                    setShowDeleteUserPrompt(
                      false,
                    )}
                >
                  {commonStrings.cancelDelete}
                </button>
                <button
                  className={successButtonClassName}
                  onClick={() => downloadUserData(
                    () => deleteUserAccount(false),
                  )}
                >
                  {languageStrings.downloadAndDeleteAccount}
                </button>
                <button
                  className={dangerButtonClassName}
                  onClick={() => deleteUserAccount()}
                >
                  {commonStrings.confirmDelete}
                </button>
              </>}
            >
              {languageStrings.deleteAccountConfirmation}
              <br /><br />
              {languageStrings.deleteAccountConsequences}
            </ModalDialog>
          }
          <button
            className={`${dangerLinkClassName} block`}
            onClick={() =>
              setShowDeleteUserPrompt(true)
            }
          >{
            languageStrings.deleteAccount
          }</button>

          <button
            className={`${dangerLinkClassName} block`}
            onClick={signOut}
          >{
            commonStrings.signOut
          }</button>

        </div>
      }</FilterUsers>
    </>
  }</Layout>;
}
