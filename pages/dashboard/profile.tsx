import { signOut } from 'firebase/auth';
import { onValue, ref, set } from 'firebase/database';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import FilterUsers from '../../components/FilterUsers';
import { useAuth, useFirebase } from '../../components/FirebaseApp';
import {
  dangerButtonClassName,
  dangerLinkClassName,
  LabeledField,
  primaryButtonClassName,
  successButtonClassName,
} from '../../components/InteractivePrimitives';
import { LanguageContext } from '../../components/LanguageContext';
import Layout from '../../components/Layout';
import { Loading, ModalDialog } from '../../components/ModalDialog';
import { contentClassName } from '../../components/UI';
import commonLocalizationStrings from '../../const/commonStrings';
import type { Language, LocalizationStrings } from '../../lib/languages';
import { extractString } from '../../lib/languages';
import { safe } from '../../lib/typescriptCommonTypes';
import { extractUser } from '../../lib/userUtils';

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
  const { firebaseAuth, firebaseDatabase } = useFirebase();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showDeleteUserPrompt, setShowDeleteUserPrompt] =
    React.useState<boolean>(false);
  const language = React.useContext(LanguageContext);

  const router = useRouter();

  async function doSignOut(): Promise<void> {
    await router.push('/');
    await signOut(safe(firebaseAuth));
  }

  async function deleteUserAccount(changeState = false): Promise<void> {
    if (changeState) setIsLoading(true);

    await set(
      ref(safe(firebaseDatabase), `users/${safe(extractUser(user)).uid}`),
      undefined
    );

    await doSignOut();
  }

  function downloadUserData(callback?: () => void): void {
    setIsLoading(true);

    onValue(
      ref(safe(firebaseDatabase), `users/${safe(extractUser(user)).uid}`),
      (value) => {
        downloadFile({
          data:
            (value.val() as string) ||
            localizationStrings[language].noSavedData,
          fileName: `${safe(extractUser(user)).uid}.json`,
        });

        if (callback) callback();
      }
    );
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
        return (
          <>
            {isLoading && <Loading />}

            <FilterUsers protected>
              {({ user }): JSX.Element => (
                <div className={`${contentClassName} flex-col`}>
                  <div className="flex justify-center">
                    <Image
                      className="rounded-full"
                      // TODO: add default user avatar
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
                            onClick={(): void => setShowDeleteUserPrompt(false)}
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
                    onClick={doSignOut}
                  >
                    {commonLanguageStrings.signOut}
                  </button>
                </div>
              )}
            </FilterUsers>
          </>
        );
      }}
    </Layout>
  );
}
