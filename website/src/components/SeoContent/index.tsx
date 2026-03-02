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
      </div>
    </section>
  );
}
