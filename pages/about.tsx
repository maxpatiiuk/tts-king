import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import { Centered }                 from '../components/UI';
import { LanguageStringsStructure } from '../lib/languages';

const languageStrings: LanguageStringsStructure & {
	'en-US': {
		come_back_later: string,
	},
} = {
	'en-US': {
		come_back_later: 'We are still working on this page... Come back later',
	},
};


const about = () =>
	<Layout>{
		(language) => <>
			<PublicMenu />
			<Centered>
				<p>{languageStrings[language].come_back_later}</p>
			</Centered>
		</>
	}</Layout>;

export default about;
