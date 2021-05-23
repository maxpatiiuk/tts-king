import type { NextPageContext } from 'next';
import React from 'react';

import ErrorPage from '../components/ErrorPage';

const error = ({ statusCode }: InitialProps): JSX.Element => (
  <ErrorPage errorCode={statusCode} />
);

interface InitialProps {
  readonly statusCode: number;
}

const DEFAULT_ERROR_CODE = 404;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
error.getInitialProps = ({
  res,
  err,
}: Readonly<NextPageContext>): InitialProps => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? DEFAULT_ERROR_CODE,
});

export default error;
