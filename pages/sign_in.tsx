import Layout                                           from '../components/Layout';
import { PublicMenu }                                   from '../components/PublicMenu';
import { Loading }                                      from '../components/ModalDialog';
import React                                            from 'react';
import { auth }                                         from '../lib/firebaseConfig';
import { Centered }                                     from '../components/UI';
import { AvailableLanguages, LanguageStringsStructure } from '../lib/languages';
import LanguageContext                                  from '../components/LanguageContext';
import type firebase                                    from 'firebase/app';
import FilterUsers                                      from '../components/FilterUsers';
import { useRouter }                                    from 'next/router';

const languageStrings: LanguageStringsStructure & {
	'en-US': {
		choseSignInMethod: string,
		signInWithGoogle: string,
		unexpectedErrorHasOccurred: string,
	}
} = {
	'en-US': {
		choseSignInMethod: 'Select your preferred sign in method:',
		signInWithGoogle: 'Sign in with Google',
		unexpectedErrorHasOccurred: 'Unexpected error has occurred',
	},
};

export default function SignIn() {

	const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
	const router = useRouter();

	function initializeSignIn(language: AvailableLanguages['type']) {

		const googleAuthProvider = new auth.GoogleAuthProvider();
		auth().signInWithPopup(googleAuthProvider).then(({credential, user}) => {

			const accessToken = (
				credential as firebase.auth.OAuthCredential
			).accessToken;

			if (typeof accessToken === 'undefined' || user === null)
				return setErrorMessage(languageStrings[language].unexpectedErrorHasOccurred);

			fetch(
				'/api/authorize_user',
				{
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						accessToken: 'accessToken',
						user: {
							email: 'email',
							photoURL: 'photoURL',
							displayName: 'displayName',
						},
					}),
				},
			).then(() =>
				router.push('/profile'),
			).catch(() =>
				setErrorMessage(languageStrings[language].unexpectedErrorHasOccurred),
			);

			setErrorMessage(undefined);
			console.log(accessToken, user);

		}).catch(({message}) => {
			setErrorMessage(`${languageStrings[language].unexpectedErrorHasOccurred}:<br/>${message}`);
		});
		return <Loading />;
	}

	return <FilterUsers
		isProtected={false}
		redirectPath='/'
	>
		<LanguageContext.Consumer>
			{
				(language) => <Layout>
					<PublicMenu />
					<Centered>
						<div>
							{
								typeof errorMessage !== 'undefined' && <div
									className='p-4 text-white bg-red-400 mb-4'
								>{errorMessage}</div>
							}
							<h2>{languageStrings[language].choseSignInMethod}</h2>
							<div className="flex flex-column gap-y-1 pt-4">
								<button
									className='border border-gray-200 p-4 bg-gray-200 hover:bg-white w-full box-content'
									onClick={initializeSignIn.bind(null, language)}
								>
									{languageStrings[language].signInWithGoogle}
								</button>
							</div>
						</div>
					</Centered>
				</Layout>
			}
		</LanguageContext.Consumer>
	</FilterUsers>;
}
