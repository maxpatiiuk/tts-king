import { useRouter }            from 'next/router';
import React                    from 'react';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { Loading }              from './ModalDialog';

export default function FilterUsers({
	isProtected,
	redirectPath,
	children,
}:{
	isProtected: boolean,
	redirectPath: string,
	children: React.ReactNode
}){
	const router = useRouter();

	return <FirebaseAuthConsumer>
		{({isSignedIn}) =>
			isSignedIn === isProtected ?
				children :
				router.push(redirectPath) && <Loading />
		}
	</FirebaseAuthConsumer>;

}