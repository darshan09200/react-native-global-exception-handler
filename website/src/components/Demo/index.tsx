import React, { useRef, useEffect, useState } from 'react';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Demo() {
  return (
    <section className={styles.demoSection} id="demo">
      <div className="container">
        <Heading as="h2" className={styles.demoHeading}>
          See It In Action
        </Heading>
        <p className={styles.demoSubheading}>
          Watch how the library handles crashes gracefully on both iOS and
          Android
        </p>

        <div className={styles.demoGrid}>
          <VideoDemo
            platform="iOS"
            videoSrc="/video/iOS_demo.mp4"
            posterSrc="/img/ios-demo-poster.png"
            description="Test native crash handling with built-in simulation tools for comprehensive error testing"
          />
          <VideoDemo
            platform="Android"
            videoSrc="/video/android_demo.mp4"
            posterSrc="/img/android-demo-poster.png"
            description="Default error screen displays crash details with options to relaunch the app or quit gracefully"
          />
        </div>

        {/* CTA Section */}
        <div className={styles.ctaSection}>
          <Link
            className="button button--primary button--lg"
            to="docs/examples/basic-examples"
          >
            View Example Code
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
