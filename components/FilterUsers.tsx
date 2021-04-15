import type firebase from 'firebase/app';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthContext } from './AuthContext';
import { Loading } from './ModalDialog';
import { PrivateMenu } from './PrivateMenu';
import { PublicMenu } from './PublicMenu';
import useClientSideRendering from './useClientSideRendering';

// TODO: provide default `redirectPath` depending on `isProtected`
export default function FilterUsers<IS_PROTECTED extends boolean>({
  isProtected,
  redirectPath,
  children,
}: {
  readonly isProtected: IS_PROTECTED;
  readonly redirectPath: string;
  readonly children: (props: {
    readonly user: IS_PROTECTED extends true ? firebase.User : null;
  }) => React.ReactNode;
}): JSX.Element {
  const router = useRouter();
  const isClientSide = useClientSideRendering();
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem('signedIn', user ? '1' : '0');
  }, [user, typeof window]);

  if (
    !isClientSide ||
    typeof window === 'undefined' ||
    localStorage.getItem('signedIn') !== null
  )
    return <Loading />;
  else if (Boolean(user) === isProtected)
    return (
      <>
        {isProtected ? <PrivateMenu /> : <PublicMenu />}
        {children({
          user: user as IS_PROTECTED extends true ? firebase.User : null,
        })}
      </>
    );
  else {
    void router.push(redirectPath);
    return <Loading />;
  }
}
