import { Outlet, useMatches } from "react-router";
import { SessionNotice } from "../../features/auth/index.js";
import { Footer } from "../../widgets/footer/index.js";
import { Header } from "../../widgets/header/index.js";
import styles from "./MainLayout.module.css";

export const MainLayout = () => {
  const matches = useMatches();
  const mascotContext =
    matches
      .map((match) => match.handle?.mascotContext)
      .filter(Boolean)
      .at(-1) ?? "browse";
  return (
    <div className={styles.frame}>
      <Header />
      <main className={styles.main}>
        <SessionNotice />
        <Outlet />
      </main>
      <Footer mascotContext={mascotContext} />
    </div>
  );
};
