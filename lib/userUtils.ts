import { User } from 'firebase/auth';

export type FirebaseUser = {
  readonly user: User | 'loading' | false;
};

export const extractUser = (user: FirebaseUser['user']): User | undefined =>
  typeof user === 'object' ? user : undefined;
