import { useState } from "react";
import styles from "./ProfileSettings.module.css";

export const AppearanceSettings = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "blue");

  const changeTheme = (event) => {
    const nextTheme = event.target.value;
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem("usof-theme", nextTheme);
    } catch {}
  };

  return (
    <section className={styles.settings} aria-labelledby="appearance-settings-title">
      <h2 id="appearance-settings-title">Appearance</h2>
      <div className={styles.form}>
        <label>
          Theme
          <select value={theme} onChange={changeTheme}>
            <option value="blue">Blue</option>
            <option value="olive">Olive</option>
            <option value="silver">Silver</option>
          </select>
        </label>
      </div>
    </section>
  );
};
