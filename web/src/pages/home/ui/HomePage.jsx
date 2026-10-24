import { Link } from "react-router";
import { HelpMascot } from "../../../widgets/help-mascot/index.js";
import { PostFeed } from "../../../widgets/post-feed/ui/PostFeed.jsx";
import styles from "./HomePage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";

export const HomePage = () => {
  return (
    <div className={styles.page}>
      <WindowShell
        className={styles.welcome}
        bodyClassName={styles.welcomeBody}
        labelledBy="welcome-title"
        title="Welcome to Usof"
        titleIcon={<span className={styles.titleIcon} aria-hidden="true">?</span>}
      >
          <p className={styles.eyebrow}>Programming questions and answers</p>
          <h1 id="welcome-title">Good questions help everyone build better software.</h1>
          <p className={styles.intro}>
            Bring a coding problem, explain what you expected, and learn from
            people who have worked through similar problems.
          </p>
          <Link className={styles.actionLink} to="/about">
            How Usof works
          </Link>
      </WindowShell>

      <HelpMascot />

      <PostFeed />

      <section className={styles.guidance} aria-labelledby="guidance-title">
        <div className={styles.guidanceHeading}>
          <span className={styles.documentIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <h2 id="guidance-title">Make your question easy to answer</h2>
        </div>
        <p>Include the context, expected result, and the part that is getting in your way.</p>
        <p className={styles.guidanceHint}>Clear details help the community give practical answers.</p>
      </section>
    </div>
  );
};
