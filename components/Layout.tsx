import Head                           from 'next/head';
import React                                from 'react';
import { GetUserLanguage } from './LanguageContext';
import siteInfo                             from '../const/siteInfo';
import { domain, robots, themeColor } from '../const/siteConfig';
import {
  DEFAULT_LANGUAGE,
  LocalizationStrings,
  Language,
  AVAILABLE_LANGUAGES
}                                     from '../lib/languages';

function extractTitle(
  language: Language,
  title?: string | LocalizationStrings<{
    title: string,
  }>,
): string {

  if (typeof title === 'undefined')
    return siteInfo[language].title;

  const titleString = typeof title === 'object' ?
    title[language].title :
    title;

  return titleString.substr(-1) === ' ' ?
    `${titleString}- ${siteInfo[language].title}` :
    titleString;
}


export default function Layout<DEFINITIONS extends Record<string,
  string | Function> = Record<never,string|Function>>({
  title,
  children,
  localizationStrings,
  privatePage = false,
  pageUrl,
}: {
  title?: string | LocalizationStrings<{
    title: string,
  }>,
  children: (
    languageStrings:DEFINITIONS,
    language: Language
  ) => React.ReactNode,
  localizationStrings?: LocalizationStrings<DEFINITIONS>
  privatePage?: boolean,
  pageUrl?: string,
}):JSX.Element {
  return <GetUserLanguage localizationStrings={siteInfo}>
    {(siteInfo, language) =>
      <>
        <Head>
          <title>{
            extractTitle(language, title)
          }</title>
          <link rel='icon' href='/favicon.ico' />
          <meta name='robots' content={
            privatePage ? 'noindex,nofollow' : robots
          } />
          <meta name='description' content={
            siteInfo.description
          } />
          <meta name='keywords' content={
            siteInfo.keywords
          } />
          <meta name='author' content={siteInfo.author} />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png" sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link
            rel="manifest"
            href="/site.webmanifest"
          />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color={themeColor}
          />
          {
            typeof pageUrl !== 'undefined' &&
            <>
              {[
                ...AVAILABLE_LANGUAGES,
                'x-default',
              ].map(language =>
                <link
                  key={language}
                  rel="alternate"
                  hrefLang={language}
                  href={`${domain}${
                    language === 'x-default' ?
                      '' :
                      language
                  }${
                    pageUrl === '' ?
                      '' :
                      `${
                        language === 'x-default' ?
                          '' :
                          '/'
                      }${pageUrl}`
                  }`}
                />,
              )}
              {
                language === DEFAULT_LANGUAGE &&
                <link
                  rel="canonical"
                  href={`${domain.slice(0, -1)}${
                    pageUrl === '' ?
                      '' :
                      `/${pageUrl}`
                  }`}
                />
              }
            </>
          }
          <meta name="msapplication-TileColor" content={themeColor} />
          <meta name="theme-color" content={themeColor} />
        </Head>
        <div
          id='root'
          className='flex flex-col w-screen min-h-screen'
        >
          {children(
            typeof localizationStrings === 'undefined' ?
              // need to cheat here a little bit
              // if definitions were not provided,
              // children's first argument would be of type
              // Record<never,string|Function> because `DEFINITIONS`
              // would use it's default value in that case
              undefined as unknown as DEFINITIONS:
              localizationStrings[language],
            language
          )}
        </div>
      </>
    }
  </GetUserLanguage>;
}