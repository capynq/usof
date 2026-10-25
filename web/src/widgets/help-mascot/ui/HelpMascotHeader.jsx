import { HELP_MASCOT_STATES } from "../model/constants.js";
import styles from "./HelpMascot.module.css";

export const HelpMascotHeader = ({ pose }) => (
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
);
