import type { ReactNode } from 'react';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type RawFeature = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const rawFeatures: RawFeature[] = [
  {
    title: 'Modern Architecture',
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

export default function Features(): ReactNode {
  const slides = rawFeatures.map((f, i) => ({
    label: f.title,
    id: `feat-${i}`,
    content: (
      <div className={styles.slideBody}>
        <div className={styles.slideIconWrap}>
          <f.Svg className={styles.slideSvg} role="img" />
        </div>
        <div className={styles.slideText}>
          <Heading as="h3" className={styles.slideTitle}>
            {f.title}
          </Heading>
          <p className={styles.slideDescription}>{f.description}</p>
        </div>
      </div>
    ),
  }));

  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(0);
  const tablistRef = useRef<HTMLDivElement | null>(null);

  const onSelect = useCallback(
    (idx: number) => {
      setPrev(active);
      setActive(idx);
    },
    [active]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const count = slides.length;
      let next = active;
      switch (e.key) {
        case 'ArrowRight':
          next = (active + 1) % count;
          break;
        case 'ArrowLeft':
          next = (active - 1 + count) % count;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = count - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      setActive(next);
      const buttons =
        tablistRef.current?.querySelectorAll('button[role="tab"]');
      if (buttons && buttons[next]) {
        (buttons[next] as HTMLButtonElement).focus();
      }
    },
    [active, slides.length]
  );

  // Ensure focus style only visible when keyboard navigation occurs
  useEffect(() => {
    const handler = () => {
      document.documentElement.classList.remove('using-keyboard');
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('using-keyboard');
      }
    };
    window.addEventListener('mousedown', handler);
    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresInner}>
          <div className={styles.featuresHeader}>
            <Heading as="h2" className={styles.featuresTitle}>
              Why GlobalExceptionHandler?
            </Heading>
            <p className={styles.featuresIntro}>
              Catch crashes across JavaScript and native layers, customize
              recovery UI, and ship more resilient apps. Explore the core
              advantages below.
            </p>
          </div>
          <div className={styles.splitLayout}>
            <div
              className={styles.verticalTabs}
              role="tablist"
              aria-label="Feature highlights"
              aria-orientation="vertical"
              ref={tablistRef}
              onKeyDown={onKeyDown}
            >
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  role="tab"
                  id={s.id}
                  aria-selected={active === idx}
                  aria-controls={`${s.id}-panel`}
                  tabIndex={active === idx ? 0 : -1}
                  className={clsx(
                    styles.vertTab,
                    active === idx && styles.vertTabActive
                  )}
                  onClick={() => onSelect(idx)}
                  type="button"
                >
                  <span className={styles.vertTabLabel}>{s.label}</span>
                </button>
              ))}
            </div>
            <div className={styles.contentPane} aria-live="polite">
              {rawFeatures.map((f, idx) => {
                const direction =
                  active > prev
                    ? 'forward'
                    : active < prev
                      ? 'backward'
                      : 'static';
                const SvgComp = f.Svg;
                const isActive = active === idx;
                return (
                  <div
                    key={`feat-panel-${idx}`}
                    role="tabpanel"
                    id={`feat-${idx}-panel`}
                    aria-labelledby={`feat-${idx}`}
                    className={clsx(
                      styles.contentSlide,
                      isActive && styles.contentSlideActive,
                      direction === 'forward' && styles.slideForward,
                      direction === 'backward' && styles.slideBackward
                    )}
                    hidden={!isActive}
                    data-direction={direction}
                  >
                    <div className={styles.contentInner}>
                      <div className={styles.slideBodyRight}>
                        <div className={styles.slideText}>
                          <Heading as="h3" className={styles.slideTitle}>
                            {f.title}
                          </Heading>
                          <p className={styles.slideDescription}>
                            {f.description}
                          </p>
                        </div>
                        <div
                          className={clsx(
                            styles.slideIconWrap,
                            isActive && styles.slideIconActive
                          )}
                        >
                          <SvgComp className={styles.slideSvg} role="img" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.featuresFooter}>
            <p className={styles.featuresFootnote}>
              Want a quick demo first? Explore the{' '}
              <Link
                to="https://github.com/darshan09200/react-native-global-exception-handler/tree/main/example#readme"
                className={styles.featuresDemoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                example app README
              </Link>{' '}
              and use its simulation utilities to safely trigger crashes and
              validate your integration.
            </p>
          </div>
        </div>
        {/* Feature grid removed; merged into slides above */}
      </div>
    </section>
  );
}
