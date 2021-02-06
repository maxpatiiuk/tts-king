import { useRouter } from 'next/router';
import React         from 'react';
import { Loading }   from './ModalDialog';
import { useAuth }   from './AuthContext';

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
	const { user } = useAuth();

	return (user === null) === isProtected ?
		router.push(redirectPath) && <Loading /> :
		children;

}