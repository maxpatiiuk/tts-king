import firebase from 'firebase/app';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import FilterUsers from '../../components/FilterUsers';
import {
  dangerButtonClassName,
  dangerLinkClassName,
  LabeledField,
  primaryButtonClassName,
  successButtonClassName,
} from '../../components/InteractivePrimitives';
import Layout from '../../components/Layout';
import { Loading, ModalDialog } from '../../components/ModalDialog';
import { contentClassName } from '../../components/UI';
import commonLocalizationStrings from '../../const/commonStrings';
import type { Language, LocalizationStrings } from '../../lib/languages';
import { extractString } from '../../lib/languages';

const localizationStrings: LocalizationStrings<{
  readonly downloadData: string;
  readonly deleteAccountConfirmationTitle: string;
  readonly deleteAccountConfirmation: string;
  readonly deleteAccountConsequences: string;
  readonly downloadAndDeleteAccount: string;
  readonly noSavedData: string;
  readonly deleteAccount: string;
}> = {
  'en-US': {
    downloadData: 'Download my data',
    deleteAccountConfirmationTitle: 'Delete account?',
    deleteAccountConfirmation: `Are you sure you want to delete your
      account?`,
    deleteAccountConsequences: `You listening stats and saved stories
      would be permanently deleted.`,
    downloadAndDeleteAccount: 'Download my data and delete',
    noSavedData: "We don't have any saved data on you",
    deleteAccount: 'Delete account',
  },
};

function downloadFile({
  data,
  fileName,
}: {
  readonly data: string;
  readonly fileName: string;
}): void {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`
  );
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.append(element);

  element.click();

  element.remove();
}

export default function Profile(): JSX.Element {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [
    showDeleteUserPrompt,
    setShowDeleteUserPrompt,
  ] = React.useState<boolean>(false);
  const [currentUser, setCurrentUser] = React.useState<
    firebase.UserInfo | false
  >(false);
  const [currentLanguage, setCurrentLanguage] = React.useState<
    Language | false
  >(false);

  const router = useRouter();

  async function signOut(): Promise<void> {
    await router.push('/');
    await firebase.auth().signOut();
  }

  async function deleteUserAccount(changeState = false): Promise<void> {
    if (typeof currentUser === 'boolean') return;

    if (changeState) setIsLoading(true);

    await firebase.database().ref(`users/${currentUser.uid}`).set(undefined);

    await signOut();
  }

  function downloadUserData(callback?: () => void): void {
    if (
      typeof currentUser === 'boolean' ||
      typeof currentLanguage === 'boolean'
    )
      return;

    setIsLoading(true);

    firebase
      .database()
      .ref(`users/${currentUser.uid}`)
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      .on('value', (value: Readonly<firebase.database.DataSnapshot>) => {
        downloadFile({
          data:
            (value.val() as string) ||
            localizationStrings[currentLanguage].noSavedData,
          fileName: `${currentUser.uid}.json`,
        });

        if (callback) callback();
      });
  }

  return (
    <Layout
      privatePage
      title={extractString(commonLocalizationStrings, 'profile')}
      localizationStrings={localizationStrings}
    >
      {(
        languageStrings: Readonly<typeof localizationStrings[Language]>,
        _language: Language,
        commonLanguageStrings: Readonly<
          typeof commonLocalizationStrings[Language]
        >
      ): JSX.Element => {
        if (typeof currentLanguage === 'boolean')
          setCurrentLanguage(currentLanguage);

        return (
          <>
            {isLoading && <Loading />}

            <FilterUsers protected>
              {/* eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types */}
              {({ user }): JSX.Element => {
                if (typeof currentUser === 'boolean') setCurrentUser(user);

                return (
                  <div className={`${contentClassName} flex-col`}>
                    <div className="flex justify-center">
                      <Image
                        className="rounded-full"
                        // TODO: add default user ava
                        src={user.photoURL ?? ''}
                        alt={user.displayName ?? ''}
                        width={96}
                        height={96}
                      />
                    </div>

                    <LabeledField label="Name">{user.displayName}</LabeledField>

                    <LabeledField label="Email">{user.email}</LabeledField>

                    <button
                      type="button"
                      className={`${dangerLinkClassName} block mt-4`}
                      onClick={(): void =>
                        downloadUserData(() => setIsLoading(false))
                      }
                    >
                      {languageStrings.downloadData}
                    </button>

                    {showDeleteUserPrompt && (
                      <ModalDialog
                        title={languageStrings.deleteAccountConfirmationTitle}
                        buttons={
                          <>
                            <button
                              type="button"
                              className={primaryButtonClassName}
                              onClick={(): void =>
                                setShowDeleteUserPrompt(false)
                              }
                            >
                              {commonLanguageStrings.cancelDelete}
                            </button>
                            <button
                              type="button"
                              className={successButtonClassName}
                              onClick={(): void =>
                                downloadUserData(
                                  (): void => void deleteUserAccount(false)
                                )
                              }
                            >
                              {languageStrings.downloadAndDeleteAccount}
                            </button>
                            <button
                              type="button"
                              className={dangerButtonClassName}
                              onClick={async (): Promise<void> =>
                                deleteUserAccount()
                              }
                            >
                              {commonLanguageStrings.confirmDelete}
                            </button>
                          </>
                        }
                      >
                        {languageStrings.deleteAccountConfirmation}
                        <br />
                        <br />
                        {languageStrings.deleteAccountConsequences}
                      </ModalDialog>
                    )}
                    <button
                      type="button"
                      className={`${dangerLinkClassName} block`}
                      onClick={(): void => setShowDeleteUserPrompt(true)}
                    >
                      {languageStrings.deleteAccount}
                    </button>

                    <button
                      type="button"
                      className={`${dangerLinkClassName} block`}
                      onClick={signOut}
                    >
                      {commonLanguageStrings.signOut}
                    </button>
                  </div>
                );
              }}
            </FilterUsers>
          </>
        );
      }}
    </Layout>
  );
}
