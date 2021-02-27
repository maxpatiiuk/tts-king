import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import { Centered }                 from '../components/UI';
import { LanguageStringsStructure } from '../lib/languages';

const languageStrings: LanguageStringsStructure<{
	title: string,
	come_back_later: string,
}> = {
	'en-US': {
		title: 'About us ',
		come_back_later: 'We are still working on this page... Come back later',
	},
};


const about = () =>
	<Layout
		page_url='about'
		title={languageStrings}
	>{
		(language) => <>
			<PublicMenu />
			<Centered>
				<p>{languageStrings[language].come_back_later}</p>
			</Centered>
		</>
	}</Layout>;

export default about;
