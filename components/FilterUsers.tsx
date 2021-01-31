import { useRouter } from 'next/router';
import React         from 'react';
import { Loading }   from './ModalDialog';
import useSWR        from 'swr';
import { fetcher }   from '../lib/swrHelper';

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
	const { data:isUserAuthorized, error } = useSWR('/api/is_user_authorized',fetcher);

	return (error || !isUserAuthorized) === isProtected ?
		router.push(redirectPath) && <Loading /> :
		children;

}