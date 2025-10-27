import Head from '@docusaurus/Head';
import OriginalMetadata from '@theme-original/DocItem/Metadata';
import type MetadataType from '@theme/DocItem/Metadata';
import type { WrapperProps } from '@docusaurus/types';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { faqItems } from '../../../data/faq';

type Props = WrapperProps<typeof MetadataType>;

// Avoid undefined/NaN in JSON-LD
const safe = <T,>(v: T | undefined) =>
  v === undefined || v === null ? undefined : v;

export default function MetadataWrapper(props: Props) {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const { title, description, permalink } = metadata;

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': safe(description),
    'url': `${siteConfig.url}${permalink}`,
  };

  // Build FAQPage JSON-LD from centralized data when applicable
  let faqJson: any = null;
  try {
    const itemsForDoc = faqItems.filter((item) => {
      // include item if no docs filter is provided, or if current doc id is listed
      return (
        !item.docs || item.docs.length === 0 || item.docs.includes(metadata.id)
      );
    });

    if (itemsForDoc.length > 0) {
      faqJson = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': itemsForDoc.map((it) => ({
          '@type': 'Question',
          'name': it.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': it.answer,
          },
        })),
      };
    }
  } catch (e) {
    // noop - do not fail rendering on FAQ data issues
  }

  return (
    <>
      <OriginalMetadata {...props} />
      <Head>
        {/* Emit WebPage JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(webPage)}</script>
        {/* Emit FAQ JSON-LD for troubleshooting page (if applicable) */}
        {faqJson ? (
          <script type="application/ld+json">{JSON.stringify(faqJson)}</script>
        ) : null}
      </Head>
    </>
  );
}
