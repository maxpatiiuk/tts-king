import React          from 'react';
import Layout         from '../../components/Layout';
import { Loading }    from '../../components/ModalDialog';
import firebaseClient from 'firebase/app';
import { useRouter }  from 'next/router';

export default function sign_out() {

	const router = useRouter();

	React.useEffect(() => {
		(
			async () => {
				await firebaseClient.auth().signOut();
				await router.push('/');
			}
		)();
	}, []);

	return (
		<Layout>
			<Loading />
		</Layout>
	);
};
