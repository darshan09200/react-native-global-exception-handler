import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Features from '../components/Features';
import Hero from '../components/Hero';
import Demo from '../components/Demo';
import SeoContent from '../components/SeoContent';

export default function Home(): ReactNode {
  return (
    <Layout
      title="React Native Exception Handler for JS and Native Crashes"
      description="react-native-global-exception-handler helps React Native apps capture JavaScript and native crashes, trigger fallback flows, and forward reports to Sentry or Crashlytics."
    >
      <Hero />
      <main>
        <Demo />
        <Features />
        <SeoContent />
      </main>
    </Layout>
  );
}
