import Layout from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import { Centered } from '../components/UI';
import type { Language, LocalizationStrings } from '../lib/languages';

const localizationStrings: LocalizationStrings<{
  readonly title: string;
  readonly comeBackLater: string;
}> = {
  'en-US': {
    title: 'About us ',
    comeBackLater: 'We are still working on this page... Come back later',
  },
};

const about = (): JSX.Element => (
  <Layout
    pageUrl="about"
    title={localizationStrings}
    localizationStrings={localizationStrings}
  >
    {(
      languageStrings: Readonly<typeof localizationStrings[Language]>
    ): JSX.Element => (
      <>
        <PublicMenu />
        <Centered>
          <p>{languageStrings.comeBackLater}</p>
        </Centered>
      </>
    )}
  </Layout>
);

export default about;
