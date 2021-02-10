import * as firebaseAdmin from 'firebase-admin';
import { firebaseConfig } from '../const/siteConfig';

const privateKey = process.env['FIREBASE_PRIVATE_KEY'];
const clientEmail = process.env['FIREBASE_CLIENT_EMAIL'];
const projectId = firebaseConfig.projectId;

if (!privateKey || !clientEmail || !projectId)
	throw new Error('Failure loading Firebase credentials');

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