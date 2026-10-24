import { Link } from "react-router";
import { PostForm } from "../../../features/post-management/index.js";
import styles from "./CreatePostPage.module.css";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";

export const CreatePostPage = () => {
  return (
    <WindowShell
      className={styles.window}
      bodyClassName={styles.body}
      labelledBy="create-post-title"
      title="New question"
      titleIcon={<span className={styles.titleIcon} aria-hidden="true">✎</span>}
    >
        <div className={styles.intro}>
          <h1 id="create-post-title">Ask the community</h1>
          <p>Share the problem and the details someone needs to help.</p>
        </div>
        <PostForm />
        <Link to="/">Back to recent questions</Link>
    </WindowShell>
  );
};
