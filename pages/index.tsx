import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import Link                         from 'next/link';
import { Centered }                 from '../components/UI';
import { FirebaseAuthConsumer }     from '@react-firebase/auth';
import { LanguageStringsStructure } from '../lib/languages';
import siteInfo                     from '../const/siteInfo';

const languageStrings: LanguageStringsStructure<{
	header: string,
	paragraph_1: string,
	paragraph_2: string,
	go_to_dashboard: string,
	sign_up: string,
	action_statement: (action_link: JSX.Element) => JSX.Element,
}> = {
	'en-US': {
		header: 'Because your time is important!',
		paragraph_1: `Convert your daily news digests into a simple podcast you
			can listen to while in transit, walking or even exercising.`,
		paragraph_2: `TTS King helps you stay productive no matter where you
			are!`,
		go_to_dashboard: 'Go to your dashboard',
		sign_up: 'Sign up',
		action_statement: (action_link: JSX.Element) => <>
			{action_link}
			{' '}now and see for yourself.
		</>
	},
};


export default function index() {
	return <Layout>{
		(language) => <>
			<PublicMenu />
			<Centered>
				<h1
					className='sm:text-right text-8xl font-bold bg-clip-text
					bg-gradient-to-l sm:bg-gradient-to-tr from-yellow-400
					to-purple-400 text-transparent pb-3 flex-shrink-0'
				>
					<span className='sm:block'>{
						siteInfo[language].tts
					} </span>
					<span>{siteInfo[language].king}</span>
				</h1>
				<div>
					<h2 className='text-3xl pt-2 pb-3'>{
						languageStrings[language].header
					}</h2>
					<p>{languageStrings[language].paragraph_1}</p>
					<p className='pt-4'>{
						languageStrings[language].paragraph_2
					}</p>
					<p className='pt-3'>{
						languageStrings[language].action_statement(
							<FirebaseAuthConsumer>{
								({isSignedIn}) => isSignedIn ?
									<Link href='/dashboard'>
										<a
											className='hover:bg-red-500
											hover:text-white bg-transparent
											text-red-500'
										>{
											languageStrings[
												language].go_to_dashboard
										}</a>
									</Link> :
									<Link href='/sign_in'>
										<a className='hover:bg-red-500
											hover:text-white bg-transparent
											text-red-500'
										>{languageStrings[language].sign_up}</a>
									</Link>
							}</FirebaseAuthConsumer>,
						)
					}</p>
				</div>
			</Centered>
		</>
	}</Layout>;
}
