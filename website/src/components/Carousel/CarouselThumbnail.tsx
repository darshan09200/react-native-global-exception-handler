import React from 'react';
import styles from './style.module.css';

type PropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, index, onClick } = props;

  return (
    <div
      className={
        styles[
          'embla__thumbs__slide'.concat(
            selected ? ' embla__thumbs__slide--selected' : ''
          )
        ]
      }
    >
      <button
        onClick={onClick}
        type="button"
        className={styles['embla__thumbs__slide__number']}
      >
        {index + 1}
      </button>
    </div>
  );
};
