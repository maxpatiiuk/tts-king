import 'tailwindcss/tailwind.css';
import { AppProps }                 from 'next/app';
import ErrorBoundary                from '../components/ErrorBoundary';
import React                        from 'react';
import firebase                     from 'firebase/app';
import 'firebase/database';
import { firebaseConfig }           from '../const/siteConfig';
import { AuthProvider }             from '../components/AuthContext';
import { LanguageProvider }         from '../components/LanguageContext';

if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig);

export default function App({Component, pageProps}: AppProps) {

  return <LanguageProvider>
    <ErrorBoundary>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ErrorBoundary>
  </LanguageProvider>;
}
