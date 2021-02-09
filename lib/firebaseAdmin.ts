import * as firebaseAdmin from 'firebase-admin';
import { firebaseConfig } from '../const/siteConfig';

const privateKey = process.env['FIREBASE_PRIVATE_KEY'];
const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
const projectId = firebaseConfig.projectId;

if (!privateKey || !clientEmail || !projectId)
	throw new Error(
		`Failure load Firebase credentials.
		Follow the instructions in the README to set your Firebase credentials inside environment variables.`,
	);

if (!firebaseAdmin.apps.length)
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			privateKey,
			clientEmail,
			projectId,
		}),
		databaseURL: `https://${projectId}.firebaseio.com`,
	});

export default firebaseAdmin;