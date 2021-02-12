import React                    from 'react';
import Layout                   from '../../components/Layout';
import { PrivateMenu }          from '../../components/PrivateMenu';
import FilterUsers              from '../../components/FilterUsers';
import { FirebaseAuthConsumer } from '@react-firebase/auth';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { Content }              from '../../components/UI';


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
						({user}) => <Content>
							<pre>{
								JSON.stringify(user,null,"\t")
							}</pre>
							<FirebaseDatabaseNode
								path={`users/${user.uid}/sources`}
							>{
								({value})=>
									<Dasboard sources={value} />
							}</FirebaseDatabaseNode>
						</Content>
					}</FirebaseAuthConsumer>
				</FilterUsers>
			</>}
		</Layout>
	);
};
