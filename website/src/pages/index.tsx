import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import Features from '../components/Features';
import Hero from '../components/Hero';
import Demo from '../components/Demo';

export default function Home(): ReactNode {
  return (
    <Layout
      title={`Global Exception Handling for React Native`}
      description="Capture and report fatal JS and native crashes in React Native apps."
    >
      <Hero />
      <main>
        <Demo />
        <Features />
      </main>
    </Layout>
  );
}
