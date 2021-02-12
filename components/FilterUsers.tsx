import { useRouter }            from 'next/router';
import React                    from 'react';
import { Loading }              from './ModalDialog';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import useClientSideRendering   from './useClientSideRendering';
import {
	AuthEmission,
	RenderableChildren,
}                               from '@react-firebase/auth/dist/types';


export default function FilterUsers({
	isProtected,
	redirectPath,
	children,
}: {
	isProtected: boolean,
	redirectPath: string,
	children: RenderableChildren
}) {

	const router = useRouter();
	const isClientSide = useClientSideRendering();

	const [
		user,
		setUser
	] = React.useState<undefined|AuthEmission>(undefined);

	return isClientSide ?
		<FirebaseAuthConsumer>{
			(props) =>
				// true ?
				// props.isSignedIn === isProtected ?
					typeof user === 'undefined' ?
						props.user === null ?
							<Loading /> :
							setUser(props.user) :
						children(props) /*:*/
					// router.push(redirectPath) && <Loading />
		}</FirebaseAuthConsumer> :
		<></>;

}