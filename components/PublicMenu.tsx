import { AvailableLanguages, LanguageStringsStructure } from '../lib/languages';
import SiteInfo                                         from '../const/siteInfo';
import React                                            from 'react';
import LanguageContext                                  from './LanguageContext';
import Link                                             from 'next/Link';
import { useRouter } from 'next/Router'

interface ErrorPageLocalization extends LanguageStringsStructure {
	'en-US': {
		about: string,
		signIn: string,
		signUp: string,
		pricing: string,
	},
}

const Navigation: ErrorPageLocalization = {
	'en-US': {
		about: 'About',
		signIn: 'Sign In',
		signUp: 'Sign Up',
		pricing: 'Pricing',
	},
};

interface MenuItem {
	label: string,
	classNames?: string,  // ''
	collapsable?: boolean,  // true
}

const menuItemsDictionary = (language: AvailableLanguages['type']): (
	Record<'left' | 'right', Record<string, MenuItem>>
	) => (
	{
		'left': {
			'/': {
				label: SiteInfo[language].title,
				classNames: 'font-bold bg-clip-text bg-gradient-to-l ' +
					'from-yellow-400 to-purple-400 text-transparent',
				collapsable: false,
			},
			'/about': {
				label: Navigation[language].about,
			},
			'/pricing': {
				label: Navigation[language].pricing,
			},
		},
		'right': {
			'/sign_in': {
				label: Navigation[language].signIn,
			},
			'/sign_up': {
				label: Navigation[language].signUp,
			},
		},
	}
);

const MenuItems = ({
	menuItems,
	currentPage
}: {
	menuItems: Record<string, MenuItem>,
	currentPage: string,
}) => <div className='flex gap-x-4 items-center'>{
	Object.entries(menuItems).map(([linkPath, menuItem], index) =>
		<Link
			href={linkPath}
			key={index}
		>
			<a className={
				`hover:text-black
				${
					menuItem.classNames ||
					(
						currentPage===linkPath ?
							'text-gray-300 underline' :
							'text-gray-600'
					)
				}`
			}>{menuItem.label}</a>
		</Link>,
	)
}</div>;

export function PublicMenu() {

	const { route } = useRouter();

	return <LanguageContext.Consumer>{
		(language) => <header className='p-4 border-b mb-4'>
			<div className="container flex flex-wrap justify-between max-w-screen-lg mx-auto">
				<MenuItems currentPage={route} menuItems={menuItemsDictionary(language).left} />
				<MenuItems currentPage={route} menuItems={menuItemsDictionary(language).right} />
			</div>
		</header>
	}</LanguageContext.Consumer>;
}