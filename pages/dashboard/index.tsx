import React                   from 'react';
import Layout                  from '../../components/Layout';
import FilterUsers             from '../../components/FilterUsers';
import { contentClassName }    from '../../components/UI';
import { LocalizationStrings } from '../../lib/languages';
import firebase                from 'firebase/app';
import 'firebase/database';
import { AuthContext }         from '../../components/AuthContext';

const localizationStrings:LocalizationStrings<{
  title: string
}> = {
  'en-US': {
    title: 'Dashboard'
  }
};

export default function Dashboard() {

  const {user} = React.useContext(AuthContext);

  const [sources, setSources] =
    React.useState<firebase.database.DataSnapshot|undefined>(undefined);

  React.useEffect(()=>{

    if(!user)
      return;

    firebase.database().ref(
      `users/${user.uid}/sources`
    ).on('value',(value)=>setSources(value.val()));

  },[user]);


  return <Layout
    title={localizationStrings}
    localizationStrings={localizationStrings}
    privatePage
  >{
    () => <FilterUsers
      isProtected={true}
      redirectPath={'/sign_in'}
    >{
      () => <div className={contentClassName}>
        <p>{JSON.stringify(sources)}</p>
      </div>
    }</FilterUsers>
  }</Layout>;
};
