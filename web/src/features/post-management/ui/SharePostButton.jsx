import { useState } from "react";

export const SharePostButton = ({ post }) => {
  const [feedback, setFeedback] = useState("");

  const share = async () => {
    const url = new URL(`/posts/${post.id}`, window.location.origin).href;

    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
        setFeedback("Question shared.");
      } else {
        await navigator.clipboard.writeText(url);
        setFeedback("Question link copied.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        setFeedback(`Could not share automatically. Copy this link: ${url}`);
      }
    }
  };

  return (
    <div className="inline-action">
      <button type="button" onClick={share}>
        Share question
      </button>
      <span role="status">{feedback}</span>
    </div>
  );
};
