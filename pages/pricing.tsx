import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import { Centered }            from '../components/UI';
import { LocalizationStrings } from '../lib/languages';

const localizationStrings: LocalizationStrings<{
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
    pageUrl='pricing'
    title={localizationStrings}
    localizationStrings={localizationStrings}
  >{
    (languageStrings) => <>
      <PublicMenu />
      <Centered>
        <h1 className='text-9xl font-bold'>{
          languageStrings.header
        }</h1>
        <p className='text-xl'>{
          languageStrings.subheader
        }</p>
      </Centered>
    </>
  }</Layout>;

export default pricing;
