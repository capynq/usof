import styles from "./AboutPage.module.css";

export const AboutPage = () => {
  return (
    <section className={`window ${styles.window}`} aria-labelledby="about-title">
      <div className="title-bar">
        <div className="title-bar-text">About Usof</div>
      </div>
      <article className={`window-body ${styles.article}`}>
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
      </article>
    </section>
  );
};
