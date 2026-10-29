import { getMascotPresentation } from "./model/presentation.js";
import { MascotArt } from "./MascotArt.jsx";
import styles from "./PassiveMascot.module.css";

export const FooterCompanion = ({ context = "browse" }) => {
  const mascot = getMascotPresentation(context);

  return (
    <aside
      className={`${styles.footer} ${styles[mascot.id]}`}
      aria-label={`${mascot.name}, your Usof helper`}
    >
      <MascotArt characterId={mascot.id} placement="footer" />
      <span>{mascot.name}</span>
    </aside>
  );
};
