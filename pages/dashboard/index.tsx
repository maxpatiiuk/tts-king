import React                    from 'react';
import Layout                   from '../../components/Layout';
import FilterUsers              from '../../components/FilterUsers';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { Content }              from '../../components/UI';


export default function dashboard() {
	return <Layout>{
		() => <FilterUsers
				isProtected={true}
				redirectPath={'/sign_in'}
			>{
				({user}) => <Content>
					<pre>{
						JSON.stringify(user,null,"\t")
					}</pre>
					<FirebaseDatabaseNode
						path={`users/${user.uid}/sources`}
					>{
						({value})=>
							// <Dashboard sources={value} />
							<p>{JSON.stringify(value)}</p>
					}</FirebaseDatabaseNode>
				</Content>
			}</FilterUsers>
	}</Layout>;
};
