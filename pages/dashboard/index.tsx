import React                  from 'react';
import { GetServerSideProps } from 'next';
import verifyAuthToken        from '../../lib/verifyAuthToken';
import Layout                 from '../../components/Layout';
import { PrivateMenu }        from '../../components/PrivateMenu';
import { Centered }           from '../../components/UI';

interface DashboardProps {
	email: string,
	uid: string,
}

export default function dashboard(props:DashboardProps){
	return (
		<Layout>
			<PrivateMenu />
			<Centered>
				<p>{JSON.stringify(props)}</p>
			</Centered>
		</Layout>
	);
};

export const getServerSideProps:GetServerSideProps = async(context)=>{
	const authStatus = await verifyAuthToken(context);

	if(authStatus.error)
		return authStatus.response;

	else
		return {
			props: {
				email: authStatus.token.email,
				uid: authStatus.token.uid,
			}
		}
};