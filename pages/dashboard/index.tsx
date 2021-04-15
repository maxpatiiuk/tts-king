import firebase from 'firebase/app';
import React from 'react';
import { AuthContext } from '../../components/AuthContext';
import FilterUsers from '../../components/FilterUsers';
import Layout from '../../components/Layout';
import { contentClassName } from '../../components/UI';
import type { LocalizationStrings } from '../../lib/languages';

const localizationStrings: LocalizationStrings<{
  title: string;
}> = {
  'en-US': {
    title: 'Dashboard',
  },
};

export default function Dashboard(): JSX.Element {
  const { user } = React.useContext(AuthContext);

  const [sources, setSources] = React.useState<
    firebase.database.DataSnapshot | undefined
  >(undefined);

  React.useEffect(() => {
    if (!user) return;

    firebase
      .database()
      .ref(`users/${user.uid}/sources`)
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      .on('value', (value: Readonly<firebase.database.DataSnapshot>) =>
        setSources(value.val())
      );
  }, [user]);

  return (
    <Layout
      title={localizationStrings}
      localizationStrings={localizationStrings}
      privatePage
    >
      {(): JSX.Element => (
        <FilterUsers isProtected={true} redirectPath={'/sign_in'}>
          {(): JSX.Element => (
            <div className={contentClassName}>
              <p>{JSON.stringify(sources)}</p>
            </div>
          )}
        </FilterUsers>
      )}
    </Layout>
  );
}
