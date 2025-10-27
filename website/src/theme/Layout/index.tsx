import { type ReactNode } from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type { WrapperProps } from '@docusaurus/types';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const pkg = require('../../../../package.json');
const { version } = pkg || { version: undefined };

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const siteUrl = siteConfig.url + siteConfig.baseUrl;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Global Exception Handler',
    'url': `${siteUrl}`,
    'logo': `${siteUrl}img/logo-full-light.svg`,
    'sameAs': [
      'https://github.com/' + siteConfig.organizationName,
      'https://stackoverflow.com/questions/tagged/global-exception-handler',
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': siteConfig.projectName,
    'url':
      'https://github.com/' +
      siteConfig.organizationName +
      '/' +
      siteConfig.projectName,
    'image': `${siteUrl}img/logo-full-light.svg`,
    'operatingSystem': 'iOS, Android',
    'applicationCategory': 'DeveloperLibrary',
    'softwareVersion': version,
    'installUrl': `${siteUrl}docs/overview/installation`,
    // More complete offers object to satisfy structured-data checks
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'CAD',
    },
    // Optionally include aggregateRating if provided via siteConfig.customFields
    ...(siteConfig.customFields && siteConfig.customFields.aggregateRating
      ? { aggregateRating: siteConfig.customFields.aggregateRating }
      : {}),
  };

  const jsonLd = [organization, website, software];

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <Layout {...props} />
    </>
  );
}
