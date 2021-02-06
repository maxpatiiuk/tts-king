import { init } from 'next-firebase-auth';

const initAuth = () => {
	init({
		// authPageURL: '/auth',
		appPageURL: '/',
		loginAPIEndpoint: '/api/login',
		logoutAPIEndpoint: '/api/logout',
		firebaseAdminInitConfig: {
			credential: {
				projectId: process.env.FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_API_KEY,
			},
			databaseURL: process.env.FIREBASE_DATABASE_URL,
		},
		firebaseClientInitConfig: {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			databaseURL: process.env.FIREBASE_DATABASE_URL,
			projectId: process.env.FIREBASE_PROJECT_ID,
		},
		cookies: {
			name: 'TTS_KING',
			keys: [
				process.env.COOKIE_SECRET_CURRENT,
				process.env.COOKIE_SECRET_PREVIOUS,
			],
			httpOnly: true,
			maxAge: 12 * 86400 * 1000,
			overwrite: true,
			path: '/',
			sameSite: 'strict',
			//secure: true,
			signed: true,
		},
	});
};

export default initAuth;