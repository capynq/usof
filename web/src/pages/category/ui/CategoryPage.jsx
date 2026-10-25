import { useParams } from "react-router";
import { useGetCategoryQuery } from "../../../entities/category/index.js";
import { PostFeed } from "../../../widgets/post-feed/ui/PostFeed.jsx";
import { WindowShell } from "../../../shared/ui/window-shell/index.js";
import { FolderIcon } from "../../../shared/ui/icons/index.js";
import styles from "./CategoryPage.module.css";

export const CategoryPage = () => {
  const { categoryId: rawCategoryId } = useParams();
  const categoryId = Number(rawCategoryId);
  const isValidCategoryId = Number.isSafeInteger(categoryId) && categoryId > 0;
  const { data: category, error, isLoading } = useGetCategoryQuery(categoryId, {
    skip: !isValidCategoryId,
  });

  if (!isValidCategoryId) {
    return <p className={styles.error} role="alert">That category address is not valid.</p>;
  }

  if (isLoading) {
    return <p className={styles.state}>Opening category…</p>;
  }

  if (error || !category) {
    return <p className={styles.error} role="alert">This category could not be found.</p>;
  }

  return (
    <div className={styles.page}>
      <WindowShell
        title="Question category"
        labelledBy="category-title"
        className={styles.category}
        bodyClassName={styles.categoryBody}
        titleIcon={<FolderIcon className={styles.folderIcon} />}
      >
        <h1 id="category-title">{category.title}</h1>
        {category.description && <p>{category.description}</p>}
      </WindowShell>
      <PostFeed lockedCategoryId={categoryId} heading={`Questions in ${category.title}`} />
    </div>
  );
};
