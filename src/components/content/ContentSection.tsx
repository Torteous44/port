import React, { useState, useEffect } from "react";
import styles from "./ContentSection.module.css";
import MovingBanner from "../common/MovingBanner";

const VisitSiteCursor: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div className={styles.visitSiteCursor} style={{ left: x, top: y }}>
      VISIT SITE{" "}
      <img src="/uparrowright.svg" alt="↗" className={styles.arrowIcon} />
    </div>
  );
};

const ContentSection: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);
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
    if (isMobile) return; // Don't update cursor position on mobile
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    if (isMobile) return; // Don't show cursor on mobile
    setShowCursor(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Don't handle on mobile
    setShowCursor(false);
  };

  return (
    <div className={styles.contentSection}>
      {showCursor && !isMobile && (
        <VisitSiteCursor x={cursorPosition.x} y={cursorPosition.y} />
      )}
      <div className={styles.innerContent}>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutContent}>
            <p>
              I'm a full stack creative developer focused on intuitive user
              experiences. Orginally from South Africa, I am currently studying
              Computer Science & AI at IE University in Madrid.
            </p>
          </div>
          <div className={styles.aboutEmpty}>
            <div className={styles.contactInfo}>
              <a
                href="https://www.linkedin.com/in/matthew-porteous-23847a2b2/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn{" "}
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.arrowIcon}
                />
              </a>
              <a
                href="https://github.com/Torteous44"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub{" "}
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.arrowIcon}
                />
              </a>
              <a href="mailto:mattporteous44@gmail.com">
                Email{" "}
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.arrowIcon}
                />
              </a>
            </div>
          </div>
        </div>

        <MovingBanner text="PROJECTS" repetitions={27} animationDuration={20} />

        <div className={styles.gridContainer}>
          {/* Project 1 */}
          <div className={`${styles.gridItem} ${styles.projectName}`}>
            <a
              href="https://thumbsy.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <h2>
                THUMBSY.XYZ
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.projectArrow}
                />
              </h2>
            </a>
          </div>
          <div className={`${styles.gridItem} ${styles.projectDetails}`}>
            <div className={styles.detailsContainer}>
              <p className={styles.description}>
                AI-POWERED SHOPPING ASSISTANT
              </p>

              <h3>[SCOPE]</h3>
              <p>UX/UI DESIGN</p>
              <p>FULL STACK DEVELOPMENT</p>

              <h3>[TIMELINE]</h3>
              <p>NOV 2024 - JAN 2025</p>
            </div>
          </div>
          <div className={`${styles.gridItem} ${styles.projectImage}`}>
            <a
              href="https://thumbsy.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imagePlaceholder}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src="/thumbsy.svg" alt="Thumbsy" />
            </a>
          </div>

          {/* Project 2 */}
          <div className={`${styles.gridItem} ${styles.projectName}`}>
            <a
              href="https://caseprepared.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <h2>
                CASE PREPARED
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.projectArrow}
                />
              </h2>
            </a>
          </div>
          <div className={`${styles.gridItem} ${styles.projectDetails}`}>
            <div className={styles.detailsContainer}>
              <p className={styles.description}>
                AI-POWERED CONSULTING CASE INTERVIEW PREPARATION
              </p>

              <h3>[SCOPE]</h3>
              <p>UX/UI DESIGN</p>
              <p>FULL STACK DEVELOPMENT</p>
              <p>SEO</p>

              <h3>[TIMELINE]</h3>
              <p>MAR - JUN 2025</p>
            </div>
          </div>
          <div className={`${styles.gridItem} ${styles.projectImage}`}>
            <a
              href="https://caseprepared.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imagePlaceholder}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src="/caseprepared.svg" alt="Case Prepared" />
            </a>
          </div>

          {/* Project 3 */}
          <div className={`${styles.gridItem} ${styles.projectName}`}>
            <a
              href="https://use-reach.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <h2>
                REACH
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.projectArrow}
                />
              </h2>
            </a>
          </div>
          <div className={`${styles.gridItem} ${styles.projectDetails}`}>
            <div className={styles.detailsContainer}>
              <p className={styles.description}>AI-POWERED USER RESEARCH</p>

              <h3>[SCOPE]</h3>
              <p>RESEARCH</p>
              <p>SYSTEM DESIGN</p>
              <p>FULL STACK DEVELOPMENT</p>
              <h3>[TIMELINE]</h3>
              <p> FEB - APR 2023</p>
              <h3>[NOTES]</h3>
              <p>BACKED BY A WHARTON MBA VENTURE FUND</p>
            </div>
          </div>
          <div
            className={`${styles.gridItem} ${styles.projectImage} ${styles.reachImage}`}
          >
            <a
              href="https://use-reach.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imagePlaceholder}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src="/reach.svg" alt="Reach" />
            </a>
          </div>
        </div>

        <MovingBanner
          text="WEB DEVELOPMENT"
          repetitions={29}
          animationDuration={20}
        />

        <div className={styles.gridContainer}>
          {/* Project 4 */}
          <div className={`${styles.gridItem} ${styles.projectName}`}>
            <a
              href="https://azulu.nl"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <h2>
                AZULU EVENTS
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.projectArrow}
                />
              </h2>
            </a>
          </div>
          <div className={`${styles.gridItem} ${styles.projectDetails}`}>
            <div className={styles.detailsContainer}>
              <p className={styles.description}>AZULU EVENTS PLATFORM</p>

              <h3>[SCOPE]</h3>
              <p>UI DESIGN</p>
              <p>FRONT-END DEVELOPMENT</p>
              <p>CUSTOM CMS DEVELOPMENT</p>

              <h3>[TIMELINE]</h3>
              <p>JAN 2025</p>
            </div>
          </div>
          <div className={`${styles.gridItem} ${styles.projectImage}`}>
            <a
              href="https://azulu.nl"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imagePlaceholder}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src="/azulu.svg" alt="Azulu Events" />
            </a>
          </div>

          {/* Project 5 */}
          <div className={`${styles.gridItem} ${styles.projectName}`}>
            <a
              href="https://santacruzarchive.net"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              <h2>
                SANTA CRUZ ARCHIVE
                <img
                  src="/uparrowright.svg"
                  alt="↗"
                  className={styles.projectArrow}
                />
              </h2>
            </a>
          </div>
          <div className={`${styles.gridItem} ${styles.projectDetails}`}>
            <div className={styles.detailsContainer}>
              <p className={styles.description}>
                PHOTO ARCHIVE FOR SANTA CRUZ DE REAL IN SEGOVIA, SPAIN
              </p>

              <h3>[SCOPE]</h3>
              <p>UI DESIGN</p>
              <p>FULL STACK DEVELOPMENT</p>
            </div>
          </div>
          <div className={`${styles.gridItem} ${styles.projectImage}`}>
            <a
              href="https://santacruzarchive.net"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imagePlaceholder}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img src="/santacruz.svg" alt="Santa Cruz Archive" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
