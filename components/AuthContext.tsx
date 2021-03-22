import { firebaseConfig } from '../const/siteConfig';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from "react";

export const AuthContext =
  React.createContext<{user:firebase.User|null}>({user:null});

export const firebaseApp = firebase.initializeApp(firebaseConfig);

export const AuthProvider = ({
  children
}:{
  children: React.ReactNode
})=>{

  const [user, setUser] = React.useState<firebase.User|null>(null);

  React.useEffect(()=>{
    firebaseApp.auth().onAuthStateChanged(setUser);
  },[]);

  return <AuthContext.Provider value={{user}}>
    {children}
  </AuthContext.Provider>;

};