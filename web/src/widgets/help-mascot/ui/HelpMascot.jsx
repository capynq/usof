import { useState } from "react";
import { HELP_MASCOT_STATES, HELP_MASCOT_TIPS, TIP_POSES } from "../model/constants.js";
import styles from "./HelpMascot.module.css";

export const HelpMascot = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [pose, setPose] = useState("idle");

  if (!isVisible) {
    return (
      <button
        className={styles.restoreButton}
        type="button"
        onClick={() => {
          setPose("welcome");
          setIsVisible(true);
        }}
      >
        Bring Clip back
      </button>
    );
  }

  const showAnotherTip = () => {
    const nextIndex = (tipIndex + 1) % HELP_MASCOT_TIPS.length;
    setTipIndex(nextIndex);
    setPose(TIP_POSES[nextIndex]);
  };

  return (
    <aside className={styles.helper} aria-labelledby="clip-title">
      <div className={styles.heading}>
        <img
          key={pose}
          className={`${styles.mascot} ${styles[pose]}`}
          src={HELP_MASCOT_STATES[pose].sprite}
          alt=""
          aria-hidden="true"
        />
        <div>
          <h2 id="clip-title">{HELP_MASCOT_STATES[pose].heading}</h2>
          <p>Your tiny guide to asking a good question.</p>
        </div>
      </div>
      <div className={styles.bubble} aria-live="polite">
        {HELP_MASCOT_TIPS[tipIndex]}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={showAnotherTip}>Another tip</button>
        <button className={styles.hideButton} type="button" onClick={() => setIsVisible(false)}>
          Hide Clip
        </button>
      </div>
    </aside>
  );
};
