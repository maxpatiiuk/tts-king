import React                    from 'react';
import Layout                   from '../../components/Layout';
import { PrivateMenu }          from '../../components/PrivateMenu';
import { Centered }             from '../../components/UI';
import FilterUsers              from '../../components/FilterUsers';
import { FirebaseAuthConsumer } from '@react-firebase/auth';


export default function dashboard() {
	return (
		<Layout>{
			() => <>
				<PrivateMenu />
				<FilterUsers
					isProtected={true}
					redirectPath={'/sign_in'}
				>
					<FirebaseAuthConsumer>{
						({user}) => <Centered>
							<p>{JSON.stringify(user)}</p>
						</Centered>
					}</FirebaseAuthConsumer>
				</FilterUsers>
			</>}
		</Layout>
	);
};
