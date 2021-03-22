import { useRouter }          from 'next/router';
import React                  from 'react';
import { Loading }            from './ModalDialog';
import useClientSideRendering from './useClientSideRendering';
import { PrivateMenu }        from './PrivateMenu';
import { PublicMenu }         from './PublicMenu';
import { AuthContext }        from './AuthContext';
import firebase from "firebase/app";


// TODO: provide default `redirectPath` depending on `isProtected`
export default function FilterUsers<IS_PROTECTED extends boolean>({
  isProtected,
  redirectPath,
  children,
}: {
  isProtected: IS_PROTECTED,
  redirectPath: string,
  children: (props:{
    user:IS_PROTECTED extends true?firebase.User:null
  })=>React.ReactNode
}) {

  const router = useRouter();
  const isClientSide = useClientSideRendering();
  const {user} = React.useContext(AuthContext);

  React.useEffect(()=>{

    if(!user || !localStorage)
      return;

    localStorage.setItem('signedIn','1');

  },[user,typeof localStorage]);

  return (
    isClientSide &&
    !(
      !user &&
      localStorage &&
      localStorage.getItem('signedIn')==='1'
    )
  )?
    !!user === isProtected ?
      <>
        {
          isProtected ?
            <PrivateMenu /> :
            <PublicMenu />
        }
        {children({
          user: user as IS_PROTECTED extends true?firebase.User:null
        })}
      </> :
      void (
        router.push(redirectPath)
      ) ||
      <Loading /> :
    <Loading />;

}