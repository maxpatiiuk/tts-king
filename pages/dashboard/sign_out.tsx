import firebase from 'firebase/app';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthContext } from '../../components/AuthContext';
import FilterUsers from '../../components/FilterUsers';
import Layout from '../../components/Layout';
import { Loading } from '../../components/ModalDialog';
import commonLocalizationStrings from '../../const/commonStrings';
import { extractString } from '../../lib/languages';

// TODO: delete this page and replace it with a button in `dashboard/profile`

export default function SignOut(): JSX.Element {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (typeof user === 'undefined') return;
    (async (): Promise<void> => {
      localStorage.setItem('signedIn', '0');
      await firebase.auth().signOut();
      await router.push('/');
    })().catch((error) => {
      throw error;
    });
  }, [user]);

  return (
    <Layout
      title={extractString(commonLocalizationStrings, 'signOut')}
      privatePage
    >
      {(): JSX.Element => (
        <FilterUsers>
          {(): JSX.Element => {
            return <Loading />;
          }}
        </FilterUsers>
      )}
    </Layout>
  );
}
