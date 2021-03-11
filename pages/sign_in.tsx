import Layout        from '../components/Layout';
import React         from 'react';
import { Centered }  from '../components/UI';
import {
  Language,
  LanguageStringsStructure,
} from '../lib/languages';
import FilterUsers   from '../components/FilterUsers';
import { useRouter } from 'next/router';
import firebase      from 'firebase/app';

const languageStrings: LanguageStringsStructure<{
  title: string,
  choseSignInMethod: string,
  signInWithGoogle: string,
  unexpectedErrorHasOccurred: string,
}> = {
  'en-US': {
    title: 'Sign In ',
    choseSignInMethod: 'Select your preferred sign in method:',
    signInWithGoogle: 'Sign in with Google',
    unexpectedErrorHasOccurred: 'Unexpected error has occurred',
  },
};

export default function SignIn() {

  const [
    errorMessage,
    setErrorMessage,
  ] = React.useState<string | undefined>(undefined);
  const router = useRouter();

  async function initializeSignIn(
    localizedLanguageStrings: typeof languageStrings[Language]
  ) {
    try {
      setErrorMessage(undefined);
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(googleAuthProvider);
      await router.push('/dashboard');
    }
    catch (error) {
      setErrorMessage(
        `${localizedLanguageStrings.unexpectedErrorHasOccurred}:
        <br/>${error.message}`,
      );
    }
  }

  return <Layout
    pageUrl='sign_in'
    title={languageStrings}
    languageStrings={languageStrings}
  >{
    (languageStrings) => <FilterUsers
      isProtected={false}
      redirectPath='/'
    >{
      () => <Centered>
        <div>
          {
            typeof errorMessage !== 'undefined' && <div
              className='p-4 text-white bg-red-400 mb-4'
            >{errorMessage}</div>
          }
          <h2>{languageStrings.choseSignInMethod}</h2>
          <div className="flex flex-column gap-y-1 pt-4">
            <button
              className='border border-gray-200 p-4
                  bg-gray-200 hover:bg-white w-full
                  box-content'
              onClick={initializeSignIn.bind(
                null,
                languageStrings,
              )}
            >
              {languageStrings.signInWithGoogle}
            </button>
          </div>
        </div>
      </Centered>
    }</FilterUsers>
  }</Layout>;
}
