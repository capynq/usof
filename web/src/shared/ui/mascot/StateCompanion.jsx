import { MascotArt } from "./MascotArt.jsx";
import { MASCOTS } from "./model/catalog.js";
import styles from "./PassiveMascot.module.css";

export const StateCompanion = ({ kind = "empty", children }) => {
  const characterId = kind === "empty" ? "scout" : "byte";

  return (
    <div
      className={`${styles.state} ${styles[kind]}`}
      role="group"
      aria-label={`${MASCOTS[characterId].name}, your Usof helper`}
    >
      <MascotArt characterId={characterId} placement={kind} />
      <div>{children}</div>
    </div>
  );
};
