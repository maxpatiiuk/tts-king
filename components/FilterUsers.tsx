import { useRouter }            from 'next/router';
import React                    from 'react';
import { Loading }              from './ModalDialog';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import useClientSideRendering   from './useClientSideRendering';

export default function FilterUsers({
	isProtected,
	redirectPath,
	children,
}: {
	isProtected: boolean,
	redirectPath: string,
	children: JSX.Element
}) {

	const router = useRouter();
	const isClientSide = useClientSideRendering();

	return isClientSide ?
		<FirebaseAuthConsumer>{
			({isSignedIn}) =>
				isSignedIn === isProtected ?
					children :
					router.push(redirectPath) && <Loading />
		}</FirebaseAuthConsumer> :
		<></>;

}