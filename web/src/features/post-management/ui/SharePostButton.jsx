import { useEffect, useRef, useState } from "react";
import { ShareIcon } from "../../../shared/ui/icons/ShareIcon.jsx";
import styles from "./SharePostButton.module.css";

export const SharePostButton = ({ post }) => {
  const [feedback, setFeedback] = useState("");
  const [visible, setVisible] = useState(false);
  const [announcement, setAnnouncement] = useState({ message: "", slot: 0 });
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const showFeedback = (message) => {
    clearTimeout(timer.current);
    setFeedback(message);
    setVisible(true);
    setAnnouncement((previous) => ({ message, slot: 1 - previous.slot }));
    timer.current = setTimeout(() => setVisible(false), 2000);
  };

  const share = async () => {
    const url = new URL(`/posts/${post.id}`, window.location.origin).href;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
        showFeedback("Question shared");
      } else {
        await navigator.clipboard.writeText(url);
        showFeedback("Link copied");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        showFeedback("Could not share link");
      }
    }
  };

  return (
    <div className={styles.root}>
      <button className={styles.button} type="button" onClick={share} aria-label={`Share question: ${post.title}`} title="Share question">
        <ShareIcon />
      </button>
      <span className={styles.feedback} data-visible={visible} aria-hidden="true">{feedback}</span>
      <span className={styles.live} role="status">{announcement.slot === 0 ? announcement.message : ""}</span>
      <span className={styles.live} role="status">{announcement.slot === 1 ? announcement.message : ""}</span>
    </div>
  );
};
