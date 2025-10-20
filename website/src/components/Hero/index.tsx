import React, { useState, useCallback } from 'react';
import Link from '@docusaurus/Link';
import styles from './style.module.css';

export default function Hero() {
  return (
    <section className={styles.heroRoot}>
      <div className={styles.heroInner}>
        <h1 className={styles.headline}>
          Catch <span className="accent">native & JS</span> crashes
          <br />
          Show a <span className="accent">graceful fallback</span>
          <br />
          Ship <span className="accent">resilient apps</span>
        </h1>
        <p className={styles.subhead}>
          Global exception handling for React Native 0.68+: TurboModules, native
          crash interception, simulation, and TypeScript‑first APIs.
        </p>
        <PackageNamePill />
        <div className={styles.ctaRow}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/api">
            API Reference
          </Link>
        </div>
        <div className={styles.codeShell}>
          <div className={styles.codeBar}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.fileLabel}>example.ts</span>
          </div>
          <pre
            className={styles.codeLines}
          >{`import {\n  setJSExceptionHandler,\n  setNativeExceptionHandler,\n} from 'react-native-global-exception-handler';\n\nsetJSExceptionHandler((err, fatal) => {\n  // report + graceful UI\n}, true);\n\nsetNativeExceptionHandler(msg => {\n  // send to Crashlytics\n});`}</pre>
        </div>
      </div>
    </section>
  );
}

function PackageNamePill() {
  const pkg = 'react-native-global-exception-handler';
  const installCmd = `yarn add ${pkg}`;
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(installCmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }, [installCmd]);
  return (
    <div className={styles.pkgWrap}>
      <code className={styles.pkgName}>{installCmd}</code>
      <button
        type="button"
        onClick={onCopy}
        className={styles.copyBtn}
        aria-label={copied ? 'Copied install command' : 'Copy install command'}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span className={styles.installHint}>{installCmd}</span>
    </div>
  );
}
