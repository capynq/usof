import { useState } from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { formatRouteError } from "../../shared/lib/formatRouteError.js";
import styles from "./RouteErrorFallback.module.css";

const isDevelopment = import.meta.env.DEV;

export const RouteErrorFallback = () => {
  const error = useRouteError();
  const [copyFeedback, setCopyFeedback] = useState("");
  const details = isDevelopment ? formatRouteError(error, isRouteErrorResponse) : "";

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
      <section className={`window ${styles.window}`} aria-labelledby="route-error-title">
        <header className="title-bar">
          <h1 className="title-bar-text">Usof</h1>
        </header>
        <div className={styles.body}>
          <div className={styles.icon} aria-hidden="true">!</div>
          <div className={styles.message}>
            <h2 id="route-error-title">This page hit a problem</h2>
            <p>Something went wrong while opening this page. You can reload or return to Usof home.</p>
          </div>
          <div className={styles.actions}>
            <button className="button" type="button" onClick={() => window.location.reload()}>Reload page</button>
            <Link className="button" to="/">Back to Usof home</Link>
          </div>
          {isDevelopment && (
            <div className={styles.details}>
              <h3>Development details</h3>
              <pre>{details}</pre>
              <button className="button" type="button" onClick={copyDetails}>Copy error details</button>
              <p className={styles.feedback} aria-live="polite">{copyFeedback}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
