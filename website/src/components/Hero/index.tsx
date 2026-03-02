import { useState, useCallback } from 'react';
import Link from '@docusaurus/Link';
import styles from './style.module.css';

export default function Hero() {
  return (
    <section className={styles.heroRoot}>
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>react-native-global-exception-handler</p>
        <h1 className={styles.headline}>
          Handle <span className="accent">JS and native crashes</span>
          <br />
          in <span className="accent">React Native</span>
        </h1>
        <p className={styles.subhead}>
          <span className={styles.packageName}>
            react-native-global-exception-handler
          </span>{' '}
          gives React Native teams one place to catch uncaught JavaScript
          exceptions, handle native crashes, trigger fallback flows, and send
          reports to Sentry, Crashlytics, or custom backends.
        </p>
        <PackageNamePill />
        <div className={styles.ctaRow}>
          <Link
            className="button button--primary button--lg"
            to="/docs/overview/installation/"
          >
            Install the Package
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/darshan09200/react-native-global-exception-handler"
          >
            View on GitHub
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
          >{`import {\n  setJSExceptionHandler,\n  setNativeExceptionHandler,\n} from 'react-native-global-exception-handler';\n\nsetJSExceptionHandler((err, fatal) => {\n  // report + graceful UI\n}, true);\n\nsetNativeExceptionHandler(msg => {\n  // send to analytics\n});`}</pre>
        </div>
      </div>
    </section>
  );
}

function PackageNamePill() {
  const pkg = 'react-native-global-exception-handler';
  const installCmd = `npm install ${pkg}`;
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
