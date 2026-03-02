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
        Built with <strong>TurboModules</strong> support for React Native 0.68+
        so teams can adopt a crash handler without losing compatibility with
        legacy or new architecture apps.
        <ul className={styles.slidePoints}>
          <li>Works with old and new architecture projects</li>
          <li>Zero-config install for supported React Native versions</li>
          <li>Future-proof setup for long-lived apps</li>
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
        API surface so your team can standardize crash handling across React
        Native release builds.
        <ul className={styles.slidePoints}>
          <li>Single place to register handlers</li>
          <li>Consistent reporting payloads</li>
          <li>Graceful fallback and restart workflows</li>
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
        behavior, and pluggable reporters for product teams that need a better
        crash experience than the default app quit.
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
        Built-in <strong>crash simulation</strong> utilities let you validate
        fallback UX, release behavior, and crash reporting before shipping to
        users.
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
        service using flexible hooks that fit existing error monitoring
        pipelines.
        <ul className={styles.slidePoints}>
          <li>Attach custom metadata/context</li>
          <li>Rate-limit noisy error bursts</li>
          <li>Bridge site docs with real monitoring workflows</li>
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
        better editor guidance when wiring a React Native exception handler into
        production apps.
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
            Why teams install this React Native crash handler
          </Heading>
          <p className={styles.featuresIntro}>
            Use one package to capture uncaught errors, explain crash behavior
            to users, and connect monitoring services without inventing a custom
            crash pipeline from scratch.
          </p>
        </div>
        <Carousel slides={slides} />
      </div>
    </section>
  );
}
