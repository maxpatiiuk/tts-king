import { onValue, ref } from '@firebase/database';
import React from 'react';

import { useAuth, useFirebase } from '../../components/FirebaseApp';
import { Loading } from '../../components/ModalDialog';
import { safe } from '../../lib/typescriptCommonTypes';
import { extractUser } from '../../lib/userUtils';
import type { Actions } from '../../reducers/Sources';
import { reducer } from '../../reducers/Sources';
import type { RefActions, RefStates } from '../../refReducers/Sources';
import { refInitialState, refObjectDispatch } from '../../refReducers/Sources';
import { stateReducer } from '../../stateReducers/Sources';

export default function Sources(): JSX.Element {
  const firebase = useFirebase();
  const { user } = useAuth();
  const refObject = React.useRef<RefStates>(refInitialState);

  const [state, dispatch] = React.useReducer(reducer, {
    type: 'LoadingState',
  });

  const curriedDispatch = (action: Actions): void =>
    dispatch({
      ...action,
      payload: {
        firebase,
        user: safe(extractUser(user)),
      },
    });

  const refObjectDispatchCurried = (action: RefActions): void =>
    refObjectDispatch({
      ...action,
      payload: {
        refObject,
        dispatch: curriedDispatch,
      },
    });

  React.useEffect(() => {
    if (
      typeof firebase.firebaseDatabase === 'undefined' ||
      state.type !== 'LoadingState' ||
      typeof user !== 'object'
    )
      return;

    onValue(
      ref(firebase.firebaseDatabase, `users/${user.uid}/sourcesMeta`),
      (value) =>
        dispatch({
          type: 'LoadedAction',
          userSources: (value.val() as Record<never, unknown>) ?? {},
          user,
          refObjectDispatchCurried,
          payload: {
            firebase,
            user,
          },
        })
    );
  }, [user, state.type, firebase.firebaseDatabase]);

  if (state.type === 'LoadingState') return <Loading />;

  return stateReducer(<i />, {
    ...state,
    props: {
      dispatch: curriedDispatch,
    },
  });
}
