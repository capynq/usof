import { useState } from "react";
import styles from "./Image.module.css";

const revealedSources = new Set();

export const Image = ({
  src,
  alt = "",
  reveal = true,
  className = "",
  fallback = null,
  ...props
}) => {
  const [loaded, setLoaded] = useState({
    src: "",
    failed: false,
    reveal: false,
  });
  const current = loaded.src === src;

  const ready = (event) => {
    const animate = reveal && !revealedSources.has(src);
    revealedSources.add(src);
    setLoaded({ src, failed: false, reveal: animate });
    event.currentTarget.dataset.ready = "true";
  };

  if (current && loaded.failed) {
    return fallback;
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={`${className} ${current && loaded.reveal ? styles.reveal : ""}`}
      onLoad={ready}
      onError={() => setLoaded({ src, failed: true, reveal: false })}
    />
  );
};
