import type { ReactNode } from 'react';
import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Carousel from '../Carousel';
import type { Slide } from '../Carousel/types';

type RawFeature = {
  title: string;
  id: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const rawFeatures: RawFeature[] = [
  {
    title: 'Modern Architecture',
    id: 'modern-architecture',
    Svg: require('@site/static/img/undraw_react.svg').default,
    description: (
      <>
        Built with <strong>TurboModules</strong> for React Native 0.68+. Modern
        link to native functionality with minimal bridge overhead.
        <ul className={styles.slidePoints}>
          <li>Zero-config install for supported RN versions</li>
          <li>Lean native surface → faster startup</li>
          <li>Future‑proof architecture alignment</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Dual Exception Handling',
    id: 'dual-exception-handling',
    Svg: require('@site/static/img/undraw_code-inspection.svg').default,
    description: (
      <>
        Catches both <strong>JavaScript and native</strong> exceptions with one
        unified API surface.
        <ul className={styles.slidePoints}>
          <li>Single place to register handlers</li>
          <li>Consistent reporting payloads</li>
          <li>Graceful fallback UI trigger</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Highly Customizable',
    id: 'highly-customizable',
    Svg: require('@site/static/img/undraw_switches.svg').default,
    description: (
      <>
        Configurable options with <strong>custom error UI</strong>, restart
        behavior, and pluggable reporters.
        <ul className={styles.slidePoints}>
          <li>Override default handler logic</li>
          <li>Inject user-friendly recovery screens</li>
          <li>Selective restart or silent logging</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Testing & Development',
    id: 'testing-development',
    Svg: require('@site/static/img/undraw_mobile-testing.svg').default,
    description: (
      <>
        Built-in <strong>crash simulation</strong> utilities to validate your
        fallback UX before shipping.
        <ul className={styles.slidePoints}>
          <li>Trigger JS exceptions on demand</li>
          <li>Simulate native crashes safely</li>
          <li>Verify reporting pipeline end-to-end</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Production Ready',
    id: 'production-ready',
    Svg: require('@site/static/img/undraw_mobile-analytics.svg').default,
    description: (
      <>
        Integrate with <strong>Crashlytics, Sentry</strong>, or any analytics
        service using flexible hooks.
        <ul className={styles.slidePoints}>
          <li>Attach custom metadata/context</li>
          <li>Rate-limit noisy error bursts</li>
          <li>Works offline with queued dispatch</li>
        </ul>
      </>
    ),
  },
  {
    title: 'TypeScript Support',
    id: 'typescript-support',
    Svg: require('@site/static/img/undraw_code-review.svg').default,
    description: (
      <>
        Full <strong>TypeScript</strong> definitions for safer integrations and
        better editor guidance.
        <ul className={styles.slidePoints}>
          <li>Strict handler signatures</li>
          <li>Typed config options</li>
          <li>Inline docs via JSDoc annotations</li>
        </ul>
      </>
    ),
  },
];

const slides: Slide[] = rawFeatures.map(
  ({ id, title, Svg, description }, index) => ({
    id,
    title,
    tab: (onClick, selected) => (
      <button
        key={id}
        role="tab"
        id={id}
        aria-selected={selected}
        aria-controls={`${id}-panel`}
        tabIndex={selected ? 0 : -1}
        className={clsx(styles.vertTab, selected && styles.vertTabActive)}
        onClick={onClick}
        type="button"
      >
        <span className={styles.vertTabLabel}>{title}</span>
      </button>
    ),
    content: (
      <div
        key={`feat-panel-${index}`}
        role="tabpanel"
        id={`feat-${index}-panel`}
        aria-labelledby={`feat-${index}`}
        className={clsx(styles.contentSlide)}
      >
        <div className={styles.contentInner}>
          <div className={styles.slideBodyRight}>
            <div className={styles.slideText}>
              <Heading as="h3" className={styles.slideTitle}>
                {title}
              </Heading>
              <p className={styles.slideDescription}>{description}</p>
            </div>
            <div className={clsx(styles.slideIconWrap)}>
              <Svg className={styles.slideSvg} role="img" />
            </div>
          </div>
        </div>
      </div>
    ),
  })
);

export default function Features(): ReactNode {
  return (
    <section className={styles.features}>
      <div className={styles.featuresInner}>
        <div className={styles.featuresHeader}>
          <Heading as="h2" className={styles.featuresTitle}>
            Why Global Exception Handler?
          </Heading>
          <p className={styles.featuresIntro}>
            Catch crashes across JavaScript and native layers, customize
            recovery UI, and ship more resilient apps. Explore the core
            advantages below.
          </p>
        </div>
        <Carousel slides={slides} />
      </div>
    </section>
  );
}
