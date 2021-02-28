import Layout                       from '../components/Layout';
import Link                         from 'next/link';
import React                        from 'react';
import { LanguageStringsStructure } from '../lib/languages';
import { PublicMenu }               from './PublicMenu';
import { Centered }                 from './UI';

const languageStrings: LanguageStringsStructure<{
	header: string,
	message: string,
	returnToHomePage: string,
}> = {
	'en-US': {
		header: 'Oops! Nothing was found',
		message: `The page you are looking for might have been removed,
		had its name changed or is temporarily unavailable.`,
		returnToHomePage: '← Return to homepage',
	},
};

const ErrorPage = ({errorCode = 404}: {errorCode?: number}) =>
	<Layout title={errorCode.toString()} private_page>
		{(language) =>
			<>
				<PublicMenu />
				<Centered>
					<div className="text-center">
						<h1 className='text-9xl py-2 text-indigo-300'>{
							errorCode
						}</h1>
						<h2>{languageStrings[language].header}</h2>
						<p>
							{languageStrings[language].message}
							<Link href="/">
								<a className='block pt-10 transition
									text-red-400 hover:text-black'>
									{languageStrings[
										language].returnToHomePage}
								</a>
							</Link>
						</p>
					</div>
				</Centered>
			</>
		}
	</Layout>;

export default ErrorPage;