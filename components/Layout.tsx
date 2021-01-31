import Head            from 'next/head';
import React           from 'react';
import LanguageContext from './LanguageContext';
import SiteInfo        from '../const/siteInfo';
import { themeColor }  from '../const/siteConfig';

const Layout = ({
	title,
	children,
}: {
	title?: string,
	children: React.ReactNode,
}) =>
	<LanguageContext.Consumer>
		{(language) =>
			<>
				<Head>
					<title>{
						typeof title === 'undefined' ?
							SiteInfo[language].title :
							title.substr(-1) === ' ' ?
								`${title}- ${SiteInfo[language].title}` :
								title
					}</title>
					<link rel='icon' href='/favicon.ico' />
					<meta
						name='description'
						content={SiteInfo[language].description}
					/>
					<meta
						name='keywords'
						content={SiteInfo[language].keywords}
					/>
					<meta
						name='author'
						content={SiteInfo[language].author}
					/>
					<meta
						name='theme-color'
						content={themeColor}
					/>
				</Head>
				<div id='root' className='flex flex-col w-screen min-h-screen'>
					{children}
				</div>
			</>
		}
	</LanguageContext.Consumer>;

export default Layout;