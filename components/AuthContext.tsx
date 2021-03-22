import firebase        from 'firebase/app';
import 'firebase/auth';
import React           from "react";

export const AuthContext =
  React.createContext<{user:firebase.User|null}>({user:null});


export const AuthProvider = ({
  children
}:{
  children: React.ReactNode
})=>{

  const [user, setUser] = React.useState<firebase.User|null>(null);

  React.useEffect(()=>
    firebase.app().auth().onAuthStateChanged(setUser),
    []
  );

  return <AuthContext.Provider value={{user}}>
    {children}
  </AuthContext.Provider>;

};