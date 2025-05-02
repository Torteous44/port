import React, { useRef, useState, useEffect } from "react";
import styles from "./NavBarSmall.module.css";
import { HeroVisual, HeroVisualHandle } from "./HeroVisual";

const NavBarSmall: React.FC = () => {
  const heroRef = useRef<HeroVisualHandle>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !heroRef.current?.updateMousePosition) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const divisionFactor = window.innerWidth >= 1700 ? 1 : 3;
    const x =
      0.5 + ((e.clientX - rect.left) / rect.width - 0.5) / divisionFactor;
    const y =
      0.5 + (1 - (e.clientY - rect.top) / rect.height - 0.5) / divisionFactor;
    heroRef.current.updateMousePosition(x, y);
  };

  const handleMouseLeave = () => {
    if (isMobile || !heroRef.current?.updateMousePosition) return;
    heroRef.current.updateMousePosition(0.5, 0.5);
  };

  return (
    <nav
      className={styles.navbarSmall}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!isMobile && (
        <div className={styles.backgroundContainer}>
          <div className={styles.backgroundLeft} />
          <div className={styles.backgroundCenter} />
          <div className={styles.backgroundRight} />
          <HeroVisual ref={heroRef} />
        </div>
      )}
      <div className={styles.contentContainer}>
        <div className={`${styles.navbarSection} ${styles.navbarCenter}`}>
          <span>PORTFOLIO</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBarSmall;
