import React                    from 'react';
import Layout                   from '../../components/Layout';
import FilterUsers              from '../../components/FilterUsers';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { contentClassName }     from '../../components/UI';
import { LocalizationStrings }  from '../../lib/languages';

const localizationStrings:LocalizationStrings<{
  title: string
}> = {
  'en-US': {
    title: 'Dashboard'
  }
};

export default function dashboard() {
  return <Layout
    title={localizationStrings}
    localizationStrings={localizationStrings}
    privatePage
  >{
    () => <FilterUsers
      isProtected={true}
      redirectPath={'/sign_in'}
    >{
      ({user}) => <div className={contentClassName}>
          <pre>{
            JSON.stringify(user, null, '\t')
          }</pre>
        <FirebaseDatabaseNode
          path={`users/${user.uid}/sources`}
        >{
          ({value}) =>
            // <Dashboard sources={value} />
            <p>{JSON.stringify(value)}</p>
        }</FirebaseDatabaseNode>
      </div>
    }</FilterUsers>
  }</Layout>;
};
