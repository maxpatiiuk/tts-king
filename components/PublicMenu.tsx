import { AvailableLanguages, LanguageStringsStructure } from '../lib/languages';
import SiteInfo                                         from '../const/siteInfo';
import React                                       from 'react';
import LanguageContext                                  from './LanguageContext';
import Link from 'next/Link';

interface ErrorPageLocalization extends LanguageStringsStructure {
	'en-US': {
		about: string,
		signIn: string,
		signUp: string,
	},
}

const Navigation: ErrorPageLocalization = {
	'en-US': {
		about: 'About',
		signIn: 'Sign In',
		signUp: 'Sign Up',
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
	isCollapsed,
	menuItems,
}: {
	isCollapsed: boolean,
	menuItems: Record<string, MenuItem>
}) => <div className='flex gap-x-4 items-center'>{
	Object.entries(menuItems).map(([linkPath, menuItem],index)=>
		(!isCollapsed || menuItem.collapsable!==true) &&
		<Link
			href={linkPath}
			key={index}
		>
			<a className={
				`hover:text-black
				${menuItem.classNames||'text-gray-600'}
				${menuItem.collapsable===false ? '' : 'hidden md:block'}`
			}>{menuItem.label}</a>
		</Link>
	)
}</div>;

export function PublicMenu() {

	const [isCollapsed, setIsCollapsed] = React.useState<boolean>(false);

	return <LanguageContext.Consumer>{
		(language) => <header className='p-4 border-b mb-4'>
			<div className="container flex flex-wrap justify-between max-w-screen-lg mx-auto">
				<MenuItems isCollapsed={isCollapsed} menuItems={menuItemsDictionary(language).left} />
				<MenuItems isCollapsed={isCollapsed} menuItems={menuItemsDictionary(language).right} />
				<button
					role='button'
					onClick={()=>setIsCollapsed(!isCollapsed)}
					className={`rounded border border-gray-600 hover:border-black md:hidden`}
				>
					<svg
						className="fill-current h-5 w-5 m-1.5"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
					</svg>
				</button>
			</div>
		</header>
	}</LanguageContext.Consumer>;
}