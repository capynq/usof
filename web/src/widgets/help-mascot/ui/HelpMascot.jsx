import { useHelpMascotController } from "../model/useHelpMascotController.js";
import { HelpMascotActions } from "./HelpMascotActions.jsx";
import { HelpMascotHeader } from "./HelpMascotHeader.jsx";
import { HelpMascotRestoreButton } from "./HelpMascotRestoreButton.jsx";
import { HelpMascotTip } from "./HelpMascotTip.jsx";
import styles from "./HelpMascot.module.css";

export const HelpMascot = () => {
  const mascot = useHelpMascotController();

  if (!mascot.isVisible) return <HelpMascotRestoreButton onRestore={mascot.restore} />;

  return (
    <aside className={styles.helper} aria-labelledby="clip-title">
      <HelpMascotHeader pose={mascot.pose} />
      <HelpMascotTip tip={mascot.tip} />
      <HelpMascotActions onAnotherTip={mascot.showAnotherTip} onHide={mascot.hide} />
    </aside>
  );
};
