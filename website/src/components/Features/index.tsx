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
        so teams can add crash handling without giving up compatibility with
        legacy or new architecture apps.
        <ul className={styles.slidePoints}>
          <li>Works with old and new architecture projects</li>
          <li>Fast install path for supported React Native versions</li>
          <li>Solid fit for long-lived apps</li>
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
        Catch <strong>JavaScript and native</strong> exceptions through one API
        surface so your team can stop piecing together separate crash flows.
        <ul className={styles.slidePoints}>
          <li>One place to register handlers</li>
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
        Shape the crash experience with <strong>custom error UI</strong>,
        restart behavior, and pluggable reporters instead of accepting the
        default app quit.
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
        Built-in <strong>crash simulation</strong> utilities let you test
        fallback UX, release behavior, and crash reporting before users ever hit
        a fatal path.
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
        Plug into <strong>Crashlytics, Sentry</strong>, or your own analytics
        pipeline without rewriting the rest of your monitoring stack.
        <ul className={styles.slidePoints}>
          <li>Attach custom metadata/context</li>
          <li>Rate-limit noisy error bursts</li>
          <li>Bridge docs with real monitoring workflows</li>
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
        Full <strong>TypeScript</strong> definitions make integrations safer and
        editor feedback sharper when you wire crash handling into a real app.
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
            Catch the failures that matter, give users a better fallback path,
            and connect your monitoring stack without inventing a crash pipeline
            from scratch.
          </p>
        </div>
        <Carousel slides={slides} />
      </div>
    </section>
  );
}
