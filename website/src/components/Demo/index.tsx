import { useRef, useEffect, useState } from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Demo() {
  return (
    <section className={styles.demoSection} id="demo">
      <div className="container">
        <Heading as="h2" className={styles.demoHeading}>
          Watch React Native crash handling in action
        </Heading>
        <p className={styles.demoSubheading}>
          See the library log native failures, show fallback UI, and prove out
          production crash flows on both iOS and Android.
        </p>

        <div className={styles.demoGrid}>
          <VideoDemo
            platform="iOS"
            videoSrc="/video/iOS_demo.mp4"
            posterSrc="/img/ios-demo-poster.png"
            description="Test native crash handling with built-in simulation tools and validate what iOS can safely do after a fatal exception."
          />
          <VideoDemo
            platform="Android"
            videoSrc="/video/android_demo.mp4"
            posterSrc="/img/android-demo-poster.png"
            description="Android can log the failure, show crash details, and support restart-oriented recovery flows when your app needs them."
          />
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <Link
            className="button button--primary button--lg"
            to="/docs/examples/basic-examples/"
          >
            See Example Code
          </Link>
          <Link
            className="button button--secondary button--lg margin-left--sm"
            to="/docs/examples/simulate-native-crash-in-react-native/"
          >
            Simulate a Crash
          </Link>
        </div>
      </div>
    </section>
  );
}

interface VideoDemoProps {
  platform: string;
  videoSrc: string;
  posterSrc: string;
  description: string;
}

function VideoDemo({
  platform,
  videoSrc,
  posterSrc,
  description,
}: VideoDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const videoUrl = useBaseUrl(videoSrc);
  const posterUrl = useBaseUrl(posterSrc);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            // Load the video when it comes into view
            if (video.src === '') {
              video.src = videoUrl;
              video.load();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoUrl, isInView]);

  return (
    <div className={styles.demoItem}>
      <h3 className={styles.platformTitle}>{platform} Demo</h3>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          controls
          className={styles.demoVideo}
          poster={posterUrl}
          preload="none"
          onLoadedData={() => setIsLoaded(true)}
        >
          <source type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {!isLoaded && (
          <div className={styles.videoLoading}>
            <div className={styles.spinner} />
          </div>
        )}
      </div>
      <p className={styles.videoCaption}>{description}</p>
    </div>
  );
}
