import { useRouter }            from 'next/router';
import React                    from 'react';
import { Loading }              from './ModalDialog';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import useClientSideRendering   from './useClientSideRendering';
import { RenderableChildren }   from '@react-firebase/auth/dist/types';


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

	return isClientSide ?
		<FirebaseAuthConsumer>{
			(props) =>
				props.providerId === null ?
					<Loading /> :
					props.isSignedIn === isProtected ?
						children(props) :
						void (
							router.push(redirectPath)
						) ||
						<Loading />
		}</FirebaseAuthConsumer> :
		<Loading />;

}