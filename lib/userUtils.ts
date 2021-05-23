import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { FirebaseDatabase } from 'firebase/database';

export type FirebaseUser = {
  readonly user: User | 'loading' | false;
};

export const extractUser = (user: FirebaseUser['user']): User | undefined =>
  typeof user === 'object' ? user : undefined;

export type FirebaseObject = {
  readonly firebaseApp: FirebaseApp | undefined;
  readonly firebaseAuth: Auth | undefined;
  readonly firebaseDatabase: FirebaseDatabase | undefined;
};
