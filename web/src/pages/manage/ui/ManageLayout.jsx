import { NavLink, Outlet } from "react-router";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import styles from "./ManageLayout.module.css";

const sections = ["users", "categories", "posts", "comments", "reactions"];
export const ManageLayout = () => (
  <WindowShell title="Usof community management" bodyClassName={styles.managementBody}>
    <nav className="management-nav" aria-label="Management sections">
      {sections.map((section) => (
        <NavLink key={section} to={`/manage/${section}`}>
          {section === "users" ? "Members" : section[0].toUpperCase() + section.slice(1)}
        </NavLink>
      ))}
    </nav>
    <Outlet />
  </WindowShell>
);
