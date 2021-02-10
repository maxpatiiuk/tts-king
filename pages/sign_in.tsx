import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import React          from 'react';
import { Centered }   from '../components/UI';
import {
	AvailableLanguages,
	LanguageStringsStructure,
}                     from '../lib/languages';
import FilterUsers    from '../components/FilterUsers';
import { useRouter }  from 'next/router';
import firebase       from 'firebase/app';

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

	const [
		errorMessage,
		setErrorMessage,
	] = React.useState<string | undefined>(undefined);
	const router = useRouter();

	async function initializeSignIn(language: AvailableLanguages['type']) {
		try {
			setErrorMessage(undefined);
			const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
			await firebase.auth().signInWithPopup(googleAuthProvider);
			await router.push('/dashboard');
		}
		catch (error) {
			setErrorMessage(
				`${languageStrings[language].unexpectedErrorHasOccurred}:
				<br/>${error.message}`,
			);
		}
	}

	return <FilterUsers
		isProtected={false}
		redirectPath='/'
	>
		<Layout>{
			(language) => <>
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
								className='border border-gray-200 p-4 bg-gray-200
										hover:bg-white w-full box-content'
								onClick={initializeSignIn.bind(null, language)}
							>
								{languageStrings[language].signInWithGoogle}
							</button>
						</div>
					</div>
				</Centered>
			</>
		}</Layout>
	</FilterUsers>;
}
