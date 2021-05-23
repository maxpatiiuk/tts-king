import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import type { FirebaseDatabase } from 'firebase/database';
import React from 'react';
import { firebaseConfig } from '../const/siteConfig';
import { FirebaseUser } from '../lib/userUtils';

type FirebaseObject = {
  readonly firebaseApp: FirebaseApp | undefined;
  readonly firebaseAuth: Auth | undefined;
  readonly firebaseDatabase: FirebaseDatabase | undefined;
};

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
