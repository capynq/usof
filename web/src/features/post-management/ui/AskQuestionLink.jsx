import { Link } from "react-router";
import { PencilPlusIcon } from "../../../shared/ui/icons/PencilPlusIcon.jsx";
import styles from "./AskQuestionLink.module.css";

export const AskQuestionLink = ({ className = "" }) => (
  <Link className={`${styles.action} ${className}`} to="/posts/new">
    <PencilPlusIcon />
    Ask a question
  </Link>
);
