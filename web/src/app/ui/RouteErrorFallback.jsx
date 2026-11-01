import { useState } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { isDev } from "../../shared/config.js";
import { formatRouteError } from "../../shared/lib/formatRouteError.js";
import styles from "./RouteErrorFallback.module.css";

export const RouteErrorFallback = () => {
  const error = useRouteError();
  const [copyFeedback, setCopyFeedback] = useState("");
  const details = isDev ? formatRouteError(error, isRouteErrorResponse) : "";

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopyFeedback("Error details copied.");
    } catch {
      setCopyFeedback("Could not copy error details. Select and copy the text above.");
    }
  };

  return (
    <main className={styles.screen}>
      <section className={styles.content} aria-labelledby="route-error-title">
        <h1 id="route-error-title">
          A problem has been detected and Usof has stopped displaying this page.
        </h1>
        <p>
          If this is the first time you have seen this screen, reload the page. If it appears again,
          return to Usof home.
        </p>
        <p>Any unsaved changes on this page may be lost.</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <Link to="/">Back to Usof home</Link>
        </div>
        {isDev && (
          <section className={styles.details} aria-labelledby="error-details-title">
            <h2 id="error-details-title">Technical information:</h2>
            <pre>{details}</pre>
            <button type="button" onClick={copyDetails}>
              Copy error details
            </button>
            <p className={styles.feedback} role="status">
              {copyFeedback}
            </p>
          </section>
        )}
      </section>
    </main>
  );
};
