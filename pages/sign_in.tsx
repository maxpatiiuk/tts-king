import firebase from 'firebase/app';
import { useRouter } from 'next/router';
import React from 'react';
import FilterUsers from '../components/FilterUsers';
import Layout from '../components/Layout';
import { Centered } from '../components/UI';
import type { Language, LocalizationStrings } from '../lib/languages';

const localizationStrings: LocalizationStrings<{
  title: string;
  choseSignInMethod: string;
  signInWithGoogle: string;
  unexpectedErrorHasOccurred: string;
}> = {
  'en-US': {
    title: 'Sign In ',
    choseSignInMethod: 'Select your preferred sign in method:',
    signInWithGoogle: 'Sign in with Google',
    unexpectedErrorHasOccurred: 'Unexpected error has occurred',
  },
};

export default function SignIn(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  );
  const router = useRouter();

  async function initializeSignIn(
    languageStrings: Readonly<typeof localizationStrings[Language]>
  ): Promise<void> {
    try {
      setErrorMessage(undefined);
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(googleAuthProvider);
      localStorage.setItem('signedIn', '1');
      await router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '';
      setErrorMessage(
        `${languageStrings.unexpectedErrorHasOccurred}:
        <br/>${errorMessage}`
      );
    }
  }

  return (
    <Layout
      pageUrl="sign_in"
      title={localizationStrings}
      localizationStrings={localizationStrings}
    >
      {(
        languageStrings: Readonly<typeof localizationStrings[Language]>
      ): JSX.Element => (
        <FilterUsers isProtected={false} redirectPath="/">
          {(): JSX.Element => (
            <Centered>
              <div>
                {typeof errorMessage !== 'undefined' && (
                  <div className="p-4 text-white bg-red-400 mb-4">
                    {errorMessage}
                  </div>
                )}
                <h2>{languageStrings.choseSignInMethod}</h2>
                <div className="flex flex-column gap-y-1 pt-4">
                  <button
                    type="button"
                    className="border border-gray-200 p-4
                  bg-gray-200 hover:bg-white w-full
                  box-content"
                    onClick={initializeSignIn.bind(undefined, languageStrings)}
                  >
                    {languageStrings.signInWithGoogle}
                  </button>
                </div>
              </div>
            </Centered>
          )}
        </FilterUsers>
      )}
    </Layout>
  );
}
