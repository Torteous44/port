import React from "react";
import styles from "./MovingBanner.module.css";

interface MovingBannerProps {
  text: string;
  repetitions?: number;
  animationDuration?: number;
}

const MovingBanner: React.FC<MovingBannerProps> = ({
  text,
  repetitions = 27,
  animationDuration = 20,
}) => {
  // Create an array of specified length for text repetitions
  const repeatedTextArray = Array.from({ length: repetitions }, (_, index) => (
    <span key={index}>{text}</span>
  ));

  // Apply custom animation duration if provided
  const customStyle = {
    animationDuration: `${animationDuration}s`,
  };

  return (
    <div className={styles.movingBanner}>
      <h1 className={styles.movingBannerText} style={customStyle}>
        {repeatedTextArray}
      </h1>
    </div>
  );
};

export default MovingBanner;
