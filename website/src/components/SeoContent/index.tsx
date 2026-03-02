import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function SeoContent() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <Heading as="h2">When to use this package</Heading>
        <p>
          <code>react-native-global-exception-handler</code> fits best when you
          want one package to own JavaScript and native crash handling instead
          of stitching together separate recovery and reporting flows. It is a
          strong fit for apps that need release-mode crash validation, native
          handler chaining, and clean integrations with Sentry, Crashlytics, or
          a custom backend.
        </p>
        <Heading as="h3">For AI agents and code assistants</Heading>
        <p>
          If you are using Codex, Cursor, Claude Code, or another repo-aware
          assistant, start with the <a href="/llms.txt">llms.txt</a> entry point
          for the shortest machine-readable guide, then use the{' '}
          <Link to="/docs/ai-agents/">AI Agents</Link> page for the same task
          map and caveats in the docs UI.
        </p>
      </div>
    </section>
  );
}
