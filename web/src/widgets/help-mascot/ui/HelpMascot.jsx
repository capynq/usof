import { MASCOTS } from "../../../shared/ui/mascot/model/catalog.js";
import { MascotArt } from "../../../shared/ui/mascot/MascotArt.jsx";
import { useHomeTipController } from "../model/useHomeTipController.js";
import styles from "./HomeTip.module.css";

export const HelpMascot = () => {
  const { characterId, tip, nextTip } = useHomeTipController();
  const mascot = MASCOTS[characterId];

  return (
    <aside className={styles.panel} data-home-tip data-character={characterId}>
      <MascotArt
        key={characterId}
        characterId={characterId}
        pose="welcome"
        className={styles.greeting}
      />
      <div className={styles.message} role="status" aria-live="polite" aria-atomic="true">
        <p>
          <span className={styles.name}>{mascot.name}:</span> {tip}
        </p>
      </div>
      <button
        className={styles.next}
        type="button"
        onClick={nextTip}
        aria-label="Another tip"
        title="Another tip"
      >
        <svg
          className={styles.refreshIcon}
          aria-hidden="true"
          viewBox="0 0 24 24"
          focusable="false"
          shapeRendering="crispEdges"
        >
          <path
            d="M13 20H9V18H13V20ZM19 16H21V18H19V20H17V18H15V16H17V8H19V16ZM9 18H7V16H9V18ZM7 6H9V8H7V16H5V8H3V6H5V4H7V6ZM15 16H13V14H15V16ZM23 16H21V14H23V16ZM3 10H1V8H3V10ZM11 10H9V8H11V10ZM17 8H15V6H17V8ZM15 6H11V4H15V6Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </aside>
  );
};
