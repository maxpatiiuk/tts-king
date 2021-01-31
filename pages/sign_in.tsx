import Layout                   from '../components/Layout';
import { PublicMenu }           from '../components/PublicMenu';
import FilterUsers              from '../components/FilterUsers';
import { Loading }              from '../components/ModalDialog';
import React                    from 'react';
import firebase                 from 'firebase';
import { FirebaseAuthConsumer } from '@react-firebase/auth';

export default function SignIn() {

	const [signInInProcess, setSignInInProcess] = React.useState<boolean>(false);

	function initializeSignIn() {
		setSignInInProcess(true);

		const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
		void (
			firebase.auth().signInWithPopup(googleAuthProvider)
		);
		return <Loading />;
	}

	return <Layout>
		<PublicMenu />
		<FilterUsers
			isProtected={false}
			redirectPath={'/profile'}
		>
			<FirebaseAuthConsumer>
				{({isSignedIn, user, providerId}) =>
					(
						!isSignedIn && !signInInProcess
					) ?
						initializeSignIn() :
						<pre style={{height: 300, overflow: 'auto'}}>
							{JSON.stringify({isSignedIn, user, providerId}, null, 2)}
             			 </pre>
				}
			</FirebaseAuthConsumer>
		</FilterUsers>
	</Layout>;
}
