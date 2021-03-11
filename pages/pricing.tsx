import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import { Centered }                 from '../components/UI';
import { LanguageStringsStructure } from '../lib/languages';

const languageStrings: LanguageStringsStructure<{
  title: string,
  header: string,
  subheader: string,
}> = {
  'en-US': {
    title: 'Pricing ',
    header: 'It\'s free! For now...',
    subheader: 'Enjoy it while you can',
  },
};

const pricing = () =>
  <Layout
    page_url='pricing'
    title={languageStrings}
  >{
    (language) => <>
      <PublicMenu />
      <Centered>
        <h1 className='text-9xl font-bold'>{
          languageStrings[language].header
        }</h1>
        <p className='text-xl'>{
          languageStrings[language].subheader
        }</p>
      </Centered>
    </>
  }</Layout>;

export default pricing;
