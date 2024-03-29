import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import React from 'react';

import FilterUsers from '../components/FilterUsers';
import { useFirebase } from '../components/FirebaseApp';
import Layout from '../components/Layout';
import { StatusLineContext } from '../components/StatusLine';
import { Centered } from '../components/UI';
import { createNewUser } from '../lib/createNewUser';
import type { Language, LocalizationStrings } from '../lib/languages';
import { statusLineContentClassName } from '../lib/statusLineConfig';
import { safe } from '../lib/typescriptCommonTypes';

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
  const { firebaseAuth, firebaseDatabase } = useFirebase();
  const addErrorMessage = React.useContext(StatusLineContext);

  async function initializeSignIn(
    languageStrings: Readonly<typeof localizationStrings[Language]>
  ): Promise<void> {
    try {
      const googleAuthProvider = new GoogleAuthProvider();
      const userCredentials = await signInWithPopup(
        safe(firebaseAuth),
        googleAuthProvider
      );
      /*
       *If (
       *userCredentials.user.metadata.creationTime ===
       *userCredentials.user.metadata.lastSignInTime
       *)
       */
      await createNewUser(safe(firebaseDatabase), userCredentials.user);
      localStorage.setItem('signedIn', '1');
      // Await router.push('/dashboard');
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '';
      addErrorMessage({
        message: (
          <span className={`${statusLineContentClassName} bg-red-200`}>
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
                <div className="flex-column gap-y-1 flex pt-4">
                  <button
                    type="button"
                    className="hover:bg-white box-content w-full p-4 bg-gray-200 border border-gray-200"
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
