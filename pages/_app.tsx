import 'tailwindcss/tailwind.css';
import { AppProps }           from 'next/app';
import ErrorBoundary          from '../components/ErrorBoundary';
import { useRouter }          from 'next/router';
import React                  from 'react';
import LanguageContext        from '../components/LanguageContext';
import { AvailableLanguages } from '../lib/languages';
import initAuth from '../lib/initAuth'

initAuth();

export default function App({Component, pageProps}: AppProps) {

	const {defaultLocale = 'en-US', locale = defaultLocale} = useRouter();

	return <LanguageContext.Provider value={locale as AvailableLanguages['type']}>
		<ErrorBoundary>
			<Component {...pageProps} />
		</ErrorBoundary>
	</LanguageContext.Provider>;
}


/*
* TTS MASTER
*
* now:
*  TODO: finish google sign in
*  TODO: add facebook and apple sign in
*
* after done:
*  TODO: finish the `about` page
*  TODO: replace start_url in site.webmanifest
*  TODO: make page search engine indexable
*  TODO: implement Google Analytics
*  TODO: use Vercel's hosting
*  TODO: add a dark mode
*  TODO: change domain in the google auth firebase
*    (https://firebase.google.com/docs/auth/web/google-signin?authuser=0#expandable-4)
* */

/*
* NODE.JS TODO:
* swr for client-side data fetching
* .env.local for global env constants
* async/await instead of promises
* <Link
	href={{
		pathname: '/blog/[slug]',
		query: { slug: post.slug },
	}}
>
* don't export non-react components from react components! (they would cause an excess page reloads in development)
* use dynamic imports to speed up page load:
* const Fuse = (await import('fuse.js')).default; // for non react components
import dynamic from 'next/dynamic'  // for react components:

const DynamicComponentWithCustomLoading = dynamic(
	() => import('../components/hello'),
	{ loading: () => <p>...</p> }
)
*
* define css variables in a JS constants file
*
* */