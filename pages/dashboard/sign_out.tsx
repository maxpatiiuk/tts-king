import React                     from 'react';
import Layout                    from '../../components/Layout';
import { Loading }               from '../../components/ModalDialog';
import { useRouter }             from 'next/router';
import FilterUsers               from '../../components/FilterUsers';
import firebase                  from 'firebase/app';
import { extractString }         from '../../lib/languages';
import commonLocalizationStrings from '../../const/commonStrings';

//TODO: delete this page and replace it with a button in the `dashboard/profile`

export default function SignOut() {

  const router = useRouter();
  const [
    firebaseLoaded,
    setFirebaseLoaded,
  ] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (firebaseLoaded)
      (
        async () => {
          localStorage.setItem('signedIn','0');
          await firebase.auth().signOut();
          await router.push('/');
        }
      )();
  }, [firebaseLoaded]);

  return (
    <Layout
      title={extractString(commonLocalizationStrings,'signOut')}
      privatePage
    >{
      () => <FilterUsers
        isProtected={true}
        redirectPath='/'>{
        () =>
          void (
            !firebaseLoaded &&
            setFirebaseLoaded(true)
          ) ||
          <Loading />
      }</FilterUsers>
    }</Layout>
  );
};
