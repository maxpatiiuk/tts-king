import Head from 'next/head';
import React from 'react';

import commonLocalizationStrings from '../const/commonStrings';
import {
  domain,
  domainCanonical,
  robots,
  themeColor,
} from '../const/siteConfig';
import siteInfo from '../const/siteInfo';
import type { Language, LocalizationStrings } from '../lib/languages';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../lib/languages';
import { GetUserLanguage } from './LanguageContext';

function extractTitle(
  language: Language,
  title:
    | string
    | LocalizationStrings<{
        title: string;
      }>
    | ((string: Language) => string)
): string {
  if (title === '') return siteInfo[language].title;

  const titleString =
    typeof title === 'object'
      ? title[language].title
      : typeof title === 'function'
      ? title(language)
      : title;

  return titleString.endsWith(' ')
    ? `${titleString}- ${siteInfo[language].title}`
    : titleString;
}

function LinkBlocks(): JSX.Element {
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/icons/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/icons/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/icons/safari-pinned-tab.svg"
        color={themeColor}
      />
    </>
  );
}

export default function Layout<
  DEFINITIONS extends Record<
    string,
    string | ((...arguments_: readonly never[]) => unknown)
  > = Record<never, string | ((...arguments_: readonly never[]) => unknown)>
>({
  title,
  children,
  localizationStrings,
  privatePage = false,
  pageUrl,
}: {
  readonly title:
    | string
    | LocalizationStrings<{
        title: string;
      }>
    | ((string: Language) => string);
  readonly children: (
    languageStrings: DEFINITIONS,
    language: Language,
    commonStrings: Readonly<typeof commonLocalizationStrings[Language]>
  ) => React.ReactNode;
  readonly localizationStrings?: LocalizationStrings<DEFINITIONS>;
  readonly privatePage?: boolean;
  readonly pageUrl?: string;
}): JSX.Element {
  return (
    <GetUserLanguage localizationStrings={siteInfo}>
      {(
        siteInfoStrings: Readonly<typeof siteInfo[Language]>,
        language: Language
      ): JSX.Element => (
        <>
          <Head>
            <title>{extractTitle(language, title)}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="robots"
              content={privatePage ? 'noindex,nofollow' : robots}
            />
            <meta name="description" content={siteInfoStrings.description} />
            <meta name="keywords" content={siteInfoStrings.keywords} />
            <meta name="author" content={siteInfoStrings.author} />
            <LinkBlocks />
            {typeof pageUrl !== 'undefined' && (
              <>
                {[...AVAILABLE_LANGUAGES, 'x-default'].map((language) => (
                  <link
                    key={language}
                    rel="alternate"
                    hrefLang={language}
                    href={`${domain}/${
                      language === 'x-default' ? '' : language
                    }${
                      pageUrl === ''
                        ? ''
                        : `${language === 'x-default' ? '' : '/'}${pageUrl}`
                    }`}
                  />
                ))}
                {language === DEFAULT_LANGUAGE && (
                  <link
                    rel="canonical"
                    href={`${domainCanonical}${
                      pageUrl === '' ? '' : `/${pageUrl}`
                    }`}
                  />
                )}
              </>
            )}
            <meta name="msapplication-TileColor" content={themeColor} />
            <meta name="theme-color" content={themeColor} />
          </Head>
          <div id="root" className="flex flex-col w-screen min-h-screen">
            {children(
              /*
               * Need to cheat here a little bit if definitions were not
               * provided, children's first argument would be of type
               * Record<never,string|Function> because `DEFINITIONS` would
               * use it's default value in that case
               */
              typeof localizationStrings === 'undefined'
                ? (undefined as unknown as DEFINITIONS)
                : localizationStrings[language],
              language,
              commonLocalizationStrings[language]
            )}
          </div>
        </>
      )}
    </GetUserLanguage>
  );
}
