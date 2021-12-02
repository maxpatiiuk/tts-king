import type { User } from '@firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import { useAuth } from './FirebaseApp';
import { Loading } from './ModalDialog';
import { PrivateMenu } from './PrivateMenu';
import { PublicMenu } from './PublicMenu';

const defaultRedirectLocations = {
  protected: '/sign_in',
  notProtected: '/dashboard',
} as const;

export default function FilterUsers<
  IS_PROTECTED extends true | undefined = undefined
>({
  protected: pageIsProtected = undefined,
  redirectPath,
  children,
}: {
  readonly protected?: IS_PROTECTED;
  readonly redirectPath?: string;
  readonly children?: (props: {
    readonly user: IS_PROTECTED extends true ? User : null;
  }) => React.ReactNode;
}): JSX.Element {
  const router = useRouter();
  const { user } = useAuth();

  const isProtected = typeof pageIsProtected === 'boolean' && pageIsProtected;

  const resolvedRedirectPath =
    redirectPath ??
    defaultRedirectLocations[isProtected ? 'protected' : 'notProtected'];

  if (user === 'loading') return <Loading />;
  else if (Boolean(user) === isProtected)
    return typeof children === 'undefined' ? (
      <React.Fragment />
    ) : (
      <>
        {isProtected ? <PrivateMenu /> : <PublicMenu />}
        {children({
          user: user as IS_PROTECTED extends true ? User : null,
        })}
      </>
    );
  else {
    void router.push(resolvedRedirectPath);
    return <Loading />;
  }
}
