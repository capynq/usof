import { useEffect, useRef, useState } from "react";
import { ShareIcon } from "../../../shared/ui/icons/ShareIcon.jsx";
import { getActionButtonClass } from "../../../shared/ui/action-button/index.js";
import { SHARE_FEEDBACK_DURATION_MS, SHARE_MESSAGES } from "../model/constants.js";
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
    timer.current = setTimeout(() => setVisible(false), SHARE_FEEDBACK_DURATION_MS);
  };

  const share = async () => {
    const url = new URL(`/posts/${post.id}`, window.location.origin).href;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
        showFeedback(SHARE_MESSAGES.shared);
      } else {
        await navigator.clipboard.writeText(url);
        showFeedback(SHARE_MESSAGES.copied);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        showFeedback(SHARE_MESSAGES.failed);
      }
    }
  };

  return (
    <div className={styles.root}>
      <button
        className={getActionButtonClass({ iconOnly: true, extraClassName: styles.button })}
        type="button"
        onClick={share}
        aria-label={`${SHARE_MESSAGES.share}: ${post.title}`}
        title={SHARE_MESSAGES.share}
      >
        <ShareIcon />
      </button>
      <span className={styles.feedback} data-visible={visible} aria-hidden="true">
        {feedback}
      </span>
      <span className={styles.live} role="status">
        {announcement.slot === 0 ? announcement.message : ""}
      </span>
      <span className={styles.live} role="status">
        {announcement.slot === 1 ? announcement.message : ""}
      </span>
    </div>
  );
};
