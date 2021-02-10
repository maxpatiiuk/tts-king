import React                    from 'react';
import Layout                   from '../../components/Layout';
import { Loading }              from '../../components/ModalDialog';
import { useRouter }            from 'next/router';
import FilterUsers              from '../../components/FilterUsers';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import firebase                 from 'firebase/app';

export default function sign_out() {

	const router = useRouter();
	const [
		firebaseLoaded,
		setFirebaseLoaded,
	] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (firebaseLoaded)
			(
				async () => {
					await firebase.auth().signOut();
					await router.push('/');
				}
			)();
	}, [firebaseLoaded]);

	return (
		<Layout>{
			() => <FilterUsers
				isProtected={true}
				redirectPath='/'>
				<FirebaseAuthConsumer>
					{
						() =>
							void (
								!firebaseLoaded &&
								setFirebaseLoaded(true)
							) ||
							<Loading />
					}
				</FirebaseAuthConsumer>
			</FilterUsers>
		}</Layout>
	);
};
