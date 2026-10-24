import styles from "./AboutPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";

export const AboutPage = () => {
  return (
    <WindowShell as="section" bodyAs="article" title="About Usof" className={styles.window} bodyClassName={styles.article} labelledBy="about-title">
        <p className={styles.eyebrow}>About the community</p>
        <h1 id="about-title">Knowledge grows when it is shared.</h1>
        <p>
          Usof is a programming question-and-answer community for focused
          questions, useful explanations, and respectful discussion.
        </p>
        <p>
          Its interface brings the familiar details of Windows XP-era software
          to a conventional, readable community website.
        </p>
    </WindowShell>
  );
};
