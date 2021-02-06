import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import nookies                                                 from 'nookies';
import firebaseAdmin                                           from './firebaseAdmin';
import type { auth }                                                from 'firebase-admin/lib/auth';


async function verifyAuthToken(context: GetServerSidePropsContext): Promise<{
	error: false,
	token: auth.DecodedIdToken,
} | {
	error: true,
	response: GetServerSidePropsResult<never>
}> {
	try {
		const cookies = nookies.get(context);
		const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

		return {
			error: false,
			token,
		};
	}
	catch (err) {
		return {
			error: true,
			response: {
				redirect: {
					permanent: false,
					destination: '/sign_in',
				},
			},
		};
	}
}

export default verifyAuthToken;