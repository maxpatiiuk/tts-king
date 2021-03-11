import Layout                       from '../components/Layout';
import { PublicMenu }               from '../components/PublicMenu';
import Link                         from 'next/link';
import { Centered }                 from '../components/UI';
import { FirebaseAuthConsumer }     from '@react-firebase/auth';
import { LanguageStringsStructure } from '../lib/languages';
import siteInfo                     from '../const/siteInfo';

const languageStrings: LanguageStringsStructure<{
  header: string,
  paragraph1: string,
  paragraph2: string,
  goToDashboard: string,
  signUp: string,
  actionStatement: (action_link: JSX.Element) => JSX.Element,
}> = {
  'en-US': {
    header: 'Because your time is important!',
    paragraph1: `Convert your daily news digests into a simple podcast you
      can listen to while in transit, walking or even exercising.`,
    paragraph2: `TTS King helps you stay productive no matter where you
      are!`,
    goToDashboard: 'Go to your dashboard',
    signUp: 'Sign up',
    actionStatement: (action_link: JSX.Element) => <>
      {action_link}
      {' '}now and see for yourself.
    </>,
  },
};


export default function index() {
  return <Layout page_url=''>{
    (language) => <>
      <PublicMenu />
      <Centered>
        <h1
          className='sm:text-right text-8xl font-bold bg-clip-text
          bg-gradient-to-l sm:bg-gradient-to-tr from-yellow-400
          to-purple-400 text-transparent pb-3 flex-shrink-0'
        >
          <span className='sm:block'>{
            siteInfo[language].tts
          } </span>
          <span>{siteInfo[language].king}</span>
        </h1>
        <div>
          <h2 className='text-3xl pt-2 pb-3'>{
            languageStrings[language].header
          }</h2>
          <p>{languageStrings[language].paragraph1}</p>
          <p className='pt-4'>{
            languageStrings[language].paragraph2
          }</p>
          <p className='pt-3'>{
            languageStrings[language].actionStatement(
              <FirebaseAuthConsumer>{
                ({isSignedIn}) => isSignedIn ?
                  <Link href='/dashboard'>
                    <a
                      className='hover:bg-red-500
                      hover:text-white bg-transparent
                      text-red-500'
                    >{
                      languageStrings[
                        language].goToDashboard
                    }</a>
                  </Link> :
                  <Link href='/sign_in'>
                    <a className='hover:bg-red-500
                      hover:text-white bg-transparent
                      text-red-500'
                    >{languageStrings[language].signUp}</a>
                  </Link>
              }</FirebaseAuthConsumer>,
            )
          }</p>
        </div>
      </Centered>
    </>
  }</Layout>;
}
