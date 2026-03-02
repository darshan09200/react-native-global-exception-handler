import Heading from '@theme/Heading';

export default function SeoContent() {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <Heading as="h2">When to use this package</Heading>
        <p>
          <code>react-native-global-exception-handler</code> is useful when you
          need one place to register JavaScript and native crash handlers
          instead of stitching together separate recovery and reporting flows.
          It fits apps that need release-mode crash validation, native handler
          chaining, or integration with Sentry, Crashlytics, or a custom
          backend.
        </p>
      </div>
    </section>
  );
}
