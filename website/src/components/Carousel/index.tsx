import { useCallback, useEffect, useState } from 'react';
import { Thumb } from './CarouselThumbnail';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './style.module.css';
import type { Slide } from './types';
import AutoHeight from 'embla-carousel-auto-height';
import Autoplay from 'embla-carousel-autoplay';

type PropType = {
  slides: Array<Slide>;
};

export default function Carousel(props: PropType) {
  const { slides } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
    { axis: 'x', align: 'start' },
    [AutoHeight(), Autoplay()]
  );
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);

      const autoplay = emblaMainApi?.plugins()?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on('select', onSelect).on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <section className={styles.embla}>
      <div className={styles.embla__thumbs}>
        <div className={styles.embla__thumbs__viewport} ref={emblaThumbsRef}>
          <div className={styles.embla__thumbs__container}>
            {slides.map(({ id, tab }, index) =>
              tab ? (
                tab(() => onThumbClick(index), index === selectedIndex)
              ) : (
                <Thumb
                  key={id}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className={styles.embla__viewport} ref={emblaMainRef}>
        <div className={styles.embla__container}>
          {slides.map(({ id, content }) => (
            <div className={styles.embla__slide} key={id}>
              {content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
