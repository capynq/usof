import { MascotGallery } from "../../../shared/ui/mascot/MascotGallery.jsx";
import styles from "./AboutPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";

export const AboutPage = () => {
  return (
    <WindowShell
      as="section"
      bodyAs="article"
      title="About Usof"
      className={styles.window}
      bodyClassName={styles.article}
      labelledBy="about-title"
    >
      <p className={styles.eyebrow}>About the community</p>
      <h1 id="about-title">Knowledge grows when it is shared.</h1>
      <p>
        Usof is a programming question-and-answer community for focused
        questions, useful explanations, and respectful discussion.
      </p>
      <p>
        Its interface brings the familiar details of Windows XP-era software to
        a conventional, readable community website.
      </p>
      <h2>Make each question easy to follow</h2>
      <p>
        Describe the problem in a clear title, then include what you expected,
        what happened, and what you have already tried. Add the relevant code,
        error message, or other details that help someone reproduce the issue.
      </p>
      <p>
        Browse categories or search for a similar question before posting. When
        you find a helpful answer, explain what worked and keep the discussion
        respectful so the next person can learn from it too.
      </p>
      <MascotGallery />
    </WindowShell>
  );
};
