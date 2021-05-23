import type { AppProps } from 'next/app';
import React from 'react';
import 'tailwindcss/tailwind.css';
import ErrorBoundary from '../components/ErrorBoundary';
import { LanguageProvider } from '../components/LanguageContext';
import { StatusLineProvider } from '../components/StatusLine';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function App({
  Component,
  pageProps,
}: Readonly<AppProps>): JSX.Element {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <StatusLineProvider>
          <Component {...pageProps} />
        </StatusLineProvider>
      </ErrorBoundary>
    </LanguageProvider>
  );
}
