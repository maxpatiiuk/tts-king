import firebase from 'firebase/app';
import 'firebase/database';
import type { AppProps } from 'next/app';
import React from 'react';
import 'tailwindcss/tailwind.css';
import { AuthProvider } from '../components/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { LanguageProvider } from '../components/LanguageContext';
import { StatusLineProvider } from '../components/StatusLine';
import { firebaseConfig } from '../const/siteConfig';

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function App({
  Component,
  pageProps,
}: Readonly<AppProps>): JSX.Element {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <AuthProvider>
          <StatusLineProvider>
            <Component {...pageProps} />
          </StatusLineProvider>
        </AuthProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
