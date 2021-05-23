import type { User } from 'firebase/auth';
import type { FirebaseDatabase } from 'firebase/database';
import { ref, set } from 'firebase/database';
import { getRandomColor } from './dataGenerators';
import type { DatabaseUser } from './firebaseDataModel';

const newUserData: DatabaseUser = {
  subscribeToNewsletter: true,
  sources: {
    default: {
      type: 'category',
      label: 'Uncategorized',
      labelColor: getRandomColor(),
      priority: 0,
      postsMeta: [],
    },
  },
  postsContent: {},
  listeningStats: {},
  totalStats: {
    queuedPosts: 0,
    posts: 0,
    paragraphs: 0,
    words: 0,
    characters: 0,
  },
  deletedPostsMeta: {},
  deletedPostsContent: {},
};

export const createNewUser = async (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  firebaseDatabase: FirebaseDatabase,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  user: Readonly<User>
): Promise<void> =>
  set(ref(firebaseDatabase, `users/${user.uid}/sources`), newUserData);
