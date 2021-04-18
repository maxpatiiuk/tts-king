/*
 *
 * Error Boundary for React Components. Catches exceptions and provides
 * a stack trace
 *
 *
 */

'use strict';

import React from 'react';
import type { Language, LocalizationStrings } from '../lib/languages';
import { dangerButtonClassName } from './InteractivePrimitives';
import { GetUserLanguage } from './LanguageContext';
import { ModalDialog } from './ModalDialog';

type ErrorBoundaryState =
  | {
      readonly hasError: false;
      readonly error: undefined;
      readonly errorInfo: undefined;
    }
  | {
      readonly hasError: true;
      readonly error: { toString: () => string };
      readonly errorInfo: { componentStack: string };
    };

const localizationStrings: LocalizationStrings<{
  readonly title: string;
  readonly reload: string;
  readonly previousPage: string;
  readonly unexpectedErrorHasOccurred: string;
}> = {
  'en-US': {
    title: 'Unexpected Error',
    reload: 'Reload',
    previousPage: 'Previous page',
    unexpectedErrorHasOccurred: 'An unexpected error has occurred.',
  },
};

export default class ErrorBoundary extends React.Component<
  { children: JSX.Element },
  ErrorBoundaryState
> {
  public readonly state: ErrorBoundaryState = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
  };

  private readonly handleReload = (): void => window.location.reload();

  private readonly handleHistoryBack = (): void => window.location.reload();

  public componentDidCatch(
    error: { readonly toString: () => string },
    errorInfo: { readonly componentStack: string }
  ): void {
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  public readonly render = (): JSX.Element =>
    this.state.hasError ? (
      <GetUserLanguage localizationStrings={localizationStrings}>
        {(
          languageStrings: Readonly<typeof localizationStrings[Language]>
        ): JSX.Element => (
          <ModalDialog
            title={'Unexpected Error'}
            buttons={
              <>
                <button
                  type="button"
                  className={dangerButtonClassName}
                  onClick={this.handleReload}
                >
                  {languageStrings.reload}
                </button>
                <button
                  type="button"
                  className={dangerButtonClassName}
                  onClick={this.handleHistoryBack}
                >
                  {languageStrings.previousPage}
                </button>
              </>
            }
          >
            <p>{languageStrings.unexpectedErrorHasOccurred}</p>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          </ModalDialog>
        )}
      </GetUserLanguage>
    ) : (
      this.props.children
    );
}
