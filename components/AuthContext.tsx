import React          from 'react';
import nookies        from 'nookies';
import firebaseClient from '../lib/firebaseClient';

const AuthContext = React.createContext<{user: firebaseClient.User | null}>({
	user: null,
});

export function AuthProvider({children}: any) {
	const [user, setUser] = React.useState<firebaseClient.User | null>(null);

	React.useEffect(
		() =>
			firebaseClient.auth().onIdTokenChanged(async (user: firebaseClient.User | null) => {
				if (!user) {
					setUser(null);
					nookies.destroy(null, 'token');
					nookies.set(null, 'token', '', {});
					return;
				}

				const token = await user.getIdToken();
				setUser(user);
				nookies.destroy(null, 'token');
				nookies.set(null, 'token', token, {});
			}),
		[],
	);

	React.useEffect(() => {
		const handle = setInterval(async () => {
			const user = firebaseClient.auth().currentUser;
			if (user)
				await user.getIdToken(true);
		}, 45 * 60 * 1000);
		return () =>
			clearInterval(handle);
	}, []);

	return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => React.useContext(AuthContext);