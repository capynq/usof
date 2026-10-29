import { useState } from "react";
import styles from "./AboutPage.module.css";

const operations = [
  () => JSON.parse("{"),
  () => decodeURIComponent("%"),
  () => {
    const value = null;

    return value.missing;
  },
];

const ErrorPreview = () => {
  const [error, setError] = useState(null);

  if (error) throw error;

  const preview = () => {
    try {
      operations[Math.floor(Math.random() * operations.length)]();
    } catch (caught) {
      if (caught instanceof Error) setError(caught);
    }
  };

  return (
    <div className={styles.preview}>
      <button className="button" type="button" onClick={preview}>
        Preview error screen
      </button>
      <p>Development only: opens the error screen with a random JavaScript error.</p>
    </div>
  );
};

export default ErrorPreview;
