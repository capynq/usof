import { getMascotPresentation } from "./model/presentation.js";
import { MascotArt } from "./MascotArt.jsx";
import styles from "./PassiveMascot.module.css";

export const FormCompanion = ({ context = "writing", placement = "form" }) => {
  const mascot = getMascotPresentation(context);
  return (
    <aside
      className={`${styles.form} ${styles[mascot.id]} ${placement === "auth" ? styles.auth : ""}`}
      aria-label={`${mascot.name}, your Usof helper`}
    >
      <MascotArt characterId={mascot.id} placement={placement} />
      <p>{mascot.hint}</p>
    </aside>
  );
};
