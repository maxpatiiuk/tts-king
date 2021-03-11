import 'tailwindcss/tailwind.css';
import { AppProps }                 from 'next/app';
import ErrorBoundary                from '../components/ErrorBoundary';
import { useRouter }                from 'next/router';
import React                        from 'react';
import LanguageContext              from '../components/LanguageContext';
import { AvailableLanguages }       from '../lib/languages';
import firebase                     from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { firebaseConfig }           from '../const/siteConfig';
import { FirebaseAuthProvider }     from '@react-firebase/auth';
import { FirebaseDatabaseProvider } from '@react-firebase/database';

export default function app({Component, pageProps}: AppProps) {

  const {defaultLocale = 'en-US', locale = defaultLocale} = useRouter();

  return <LanguageContext.Provider
    value={locale as AvailableLanguages['type']}
  >
    <ErrorBoundary>
      <FirebaseAuthProvider
        firebase={firebase}
        {...firebaseConfig}
      >
        <FirebaseDatabaseProvider
          firebase={firebase}
          {...firebaseConfig}>
          <Component {...pageProps} />
        </FirebaseDatabaseProvider>
      </FirebaseAuthProvider>
    </ErrorBoundary>
  </LanguageContext.Provider>;
}


/*
* TTS MASTER
*
* now:
*  TODO: integrate users with their firestone data
*  TODO: create a record in a database whenever a new user signs in
*  TODO: add offline PWA support (and service worker)
*
* after done:
*  TODO: add facebook and apple sign in
*  TODO: replace all localhost instances in ALL FILES with real domain
*  TODO: replace " in attributes with '
*  TODO: finish the `about` page
*  TODO: make pages search engine indexable
*  TODO: implement Google Analytics
*  TODO: use Vercel's hosting
*  TODO: add a dark mode
*  TODO: change domain in the google auth firebase
*    (https://firebase.google.com/docs/auth/web/google-signin?authuser=0#expandable-4)
* */

/*
* NODE.JS TODO:
* swr for client-side data fetching
* async/await instead of promises
* <Link
  href={{
    pathname: '/blog/[slug]',
    query: { slug: post.slug },
  }}
>
* don't export non-react components from react components!
* use dynamic imports to speed up page load:
* const Fuse = (await import('fuse.js')).default; // for non react components
import dynamic from 'next/dynamic'  // for react components:

const DynamicComponentWithCustomLoading = dynamic(
  () => import('../components/hello'),
  { loading: () => <p>...</p> }
)
*
* define css variables in a JS constants file
*
* */

/*
*
* FIREBASE REALTIME DATABASE TODO:
* "$other": { ".validate": false }
* ".read": "query.orderByChild == 'owner'"
* ".read": "query.orderByKey && query.limitToFirst <= 1000"
* "auth.uid !== null" to check that any user is signed in
* orderByChild: ".indexOn": ["field_1", "field_2"] ( when parents are going to be queried based on child field)
* orderByValue: ".indexOn": ".value" ( when you have a 1d dictionary and you want to query based on values)
* ".write": "newData.exists()" - forbid deletions
* */
