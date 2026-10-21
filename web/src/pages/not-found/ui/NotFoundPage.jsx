import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <section aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>
      <p>The address may be incorrect or the page may have moved.</p>
      <Link to="/">Return to Usof home</Link>
    </section>
  );
};
