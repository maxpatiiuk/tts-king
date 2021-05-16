import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';

export const AuthContext = React.createContext<{
  user?: firebase.User;
}>({});
AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({
  children,
}: {
  readonly children: React.ReactNode;
}): JSX.Element => {
  const [user, setUser] = React.useState<firebase.User | undefined>();

  React.useEffect(
    () =>
      firebase
        .app()
        .auth()
        .onAuthStateChanged((user) => setUser(user ?? undefined)),
    []
  );

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
