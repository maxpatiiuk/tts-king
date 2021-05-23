import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';
import FilterUsers from '../components/FilterUsers';
import { useFirebase } from '../components/FirebaseApp';
import Layout from '../components/Layout';
import { StatusLineContext } from '../components/StatusLine';
import { Centered } from '../components/UI';
import { createNewUser } from '../lib/createNewUser';
import type { Language, LocalizationStrings } from '../lib/languages';
import { statusLineContentClassName } from '../lib/statusLineConfig';

const localizationStrings: LocalizationStrings<{
  readonly title: string;
  readonly choseSignInMethod: string;
  readonly signInWithGoogle: string;
  readonly unexpectedErrorHasOccurred: string;
}> = {
  'en-US': {
    title: 'Sign In ',
    choseSignInMethod: 'Select your preferred sign in method:',
    signInWithGoogle: 'Sign in with Google',
    unexpectedErrorHasOccurred: 'Unexpected error has occurred',
  },
};

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const { firebaseAuth, firebaseDatabase } = useFirebase();
  const addErrorMessage = React.useContext(StatusLineContext);

  async function initializeSignIn(
    languageStrings: Readonly<typeof localizationStrings[Language]>
  ): Promise<void> {
    try {
      if (
        typeof firebaseDatabase === 'undefined' ||
        typeof firebaseAuth === 'undefined'
      )
        throw new Error('Firebase is not initialized');

      const googleAuthProvider = new GoogleAuthProvider();
      const userCredentials = await signInWithPopup(
        firebaseAuth,
        googleAuthProvider
      );
      if (userCredentials.operationType === 'link')
        // TODO: test this code
        await createNewUser(firebaseDatabase, userCredentials.user);
      localStorage.setItem('signedIn', '1');
      await router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '';
      addErrorMessage({
        message: (
          <span className={statusLineContentClassName}>
            ${languageStrings.unexpectedErrorHasOccurred}:
            <br />${errorMessage}
          </span>
        ),
        id: '',
      });
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
        <FilterUsers>
          {(): JSX.Element => (
            <Centered>
              <div>
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
