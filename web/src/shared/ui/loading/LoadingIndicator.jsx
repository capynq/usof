import { useEffect, useState } from "react";
import styles from "./LoadingIndicator.module.css";

export const LoadingIndicator = ({ children, completing = false }) => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(completing ? 100 : 60);

      return;
    }

    if (completing) {
      const timer = setInterval(() => {
        setProgress((value) => Math.min(100, value + 20));
      }, 60);

      return () => clearInterval(timer);
    }

    setProgress(20);
    const timer = setInterval(() => {
      setProgress((value) => Math.min(80, value + 20));
    }, 500);

    return () => clearInterval(timer);
  }, [completing]);

  return (
    <div className={styles.status} role="status">
      <span>{completing ? "Preparing view…" : children}</span>
      <progress className={styles.track} max="100" value={progress} aria-hidden="true" />
    </div>
  );
};
