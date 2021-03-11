import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import { Centered }            from '../components/UI';
import { LocalizationStrings } from '../lib/languages';

const localizationStrings: LocalizationStrings<{
  title: string,
  comeBackLater: string,
}> = {
  'en-US': {
    title: 'About us ',
    comeBackLater: 'We are still working on this page... Come back later',
  },
};


const about = () =>
  <Layout
    pageUrl='about'
    title={localizationStrings}
    localizationStrings={localizationStrings}
  >{
    (languageStrings) => <>
      <PublicMenu />
      <Centered>
        <p>{languageStrings.comeBackLater}</p>
      </Centered>
    </>
  }</Layout>;

export default about;
