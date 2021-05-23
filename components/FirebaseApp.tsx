import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import React from 'react';
import { firebaseConfig } from '../const/siteConfig';
import { FirebaseObject, FirebaseUser } from '../lib/userUtils';

export const useFirebase = (): FirebaseObject => {
  const [object, setObject] = React.useState<FirebaseObject>({
    firebaseApp: undefined,
    firebaseAuth: undefined,
    firebaseDatabase: undefined,
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig);
    setObject({
      firebaseApp,
      firebaseAuth: getAuth(firebaseApp),
      firebaseDatabase: getDatabase(firebaseApp),
    });
  }, [typeof window]);

  return object;
};

export const useAuth = (): FirebaseUser => {
  const { firebaseAuth } = useFirebase();
  const [user, setUser] = React.useState<FirebaseUser['user']>('loading');

  React.useEffect(() => {
    if (typeof firebaseAuth === 'undefined') return;
    onAuthStateChanged(firebaseAuth, (user) => setUser(user ?? false));
  }, [firebaseAuth]);

  return { user };
};
