import { onValue, ref } from 'firebase/database';
import React from 'react';

import FilterUsers from '../../components/FilterUsers';
import { useAuth, useFirebase } from '../../components/FirebaseApp';
import Layout from '../../components/Layout';
import { contentClassName } from '../../components/UI';
import type { LocalizationStrings } from '../../lib/languages';
import type { DatabaseSource } from '../../lib/sources';
import type { IR } from '../../lib/typescriptCommonTypes';

const localizationStrings: LocalizationStrings<{
  readonly title: string;
}> = {
  'en-US': {
    title: 'Dashboard',
  },
};

export default function Dashboard(): JSX.Element {
  const { firebaseDatabase } = useFirebase();
  const { user } = useAuth();

  const [sources, setSources] =
    React.useState<IR<DatabaseSource> | undefined>(undefined);

  React.useEffect(() => {
    if (typeof firebaseDatabase === 'undefined' || typeof user !== 'object')
      return;

    onValue(ref(firebaseDatabase, `users/${user.uid}/sources`), (value) =>
      setSources(value.val())
    );
  }, [firebaseDatabase, user]);

  return (
    <Layout
      title={localizationStrings}
      localizationStrings={localizationStrings}
      privatePage
    >
      {(): JSX.Element => (
        <FilterUsers protected>
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
