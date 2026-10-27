import { HelpMascot } from "../../../widgets/help-mascot/index.js";
import { PostFeed } from "../../../widgets/post-feed/ui/PostFeed.jsx";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <h1 id="home-title">Questions</h1>
        <HelpMascot />
      </header>
      <PostFeed heading={null} />
    </div>
  );
};
