import firebase from 'firebase/app';
import React from 'react';
import { AuthContext } from '../../components/AuthContext';
import { Loading } from '../../components/ModalDialog';
import { reducer } from '../../reducers/Sources';
import type { RefActions, RefStates } from '../../refReducers/Sources';
import { refInitialState, refObjectDispatch } from '../../refReducers/Sources';
import { stateReducer } from '../../stateReducers/Sources';

export default function Sources(): JSX.Element {
  const { user } = React.useContext(AuthContext);
  const refObject = React.useRef<RefStates>(refInitialState);

  const [state, dispatch] = React.useReducer(reducer, {
    type: 'LoadingState',
  });

  const refObjectDispatchCurried = (action: RefActions): void =>
    refObjectDispatch({
      ...action,
      payload: {
        refObject,
        dispatch,
      },
    });

  React.useEffect(() => {
    if (!user || state.type !== 'LoadingState') return;

    firebase
      .app()
      .database()
      .ref(`users/${user.uid}/sourcesMeta`)
      .on('value', (value) => {
        dispatch({
          type: 'LoadedAction',
          userSources: (value.val() as Record<never, unknown>) ?? {},
          user,
          refObjectDispatchCurried,
        });
      });
  }, [user, state.type]);

  if (state.type === 'LoadingState') return <Loading />;

  return stateReducer(<i />, {
    ...state,
    props: {
      dispatch,
    },
  });
}
