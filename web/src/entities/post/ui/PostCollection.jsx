import { API_ERROR_MESSAGES, getErrorMessage } from "../../../shared/api/index.js";
import { useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { PostCollectionEmpty } from "./PostCollectionEmpty.jsx";
import { PostCollectionError } from "./PostCollectionError.jsx";
import { PostCollectionList } from "./PostCollectionList.jsx";
import { PostCollectionLoading } from "./PostCollectionLoading.jsx";
import styles from "./PostCollection.module.css";

export const PostCollection = ({
  posts,
  renderActions,
  error,
  isLoading,
  loadingMessage,
  emptyMessage,
  errorMessage = API_ERROR_MESSAGES.questionsCouldNotLoad,
  listClassName,
  stateClassName,
  errorClassName,
}) => {
  const { visible: showLoading, completing } = useMinimumLoading(isLoading, error);

  if (showLoading) {
    return <PostCollectionLoading completing={completing} message={loadingMessage} />;
  }

  if (error && !posts?.length) {
    return (
      <PostCollectionError
        message={getErrorMessage(error, errorMessage)}
        className={errorClassName}
      />
    );
  }

  if (posts?.length === 0) {
    return <PostCollectionEmpty message={emptyMessage} className={stateClassName} />;
  }

  if (posts?.length) {
    return (
      <PostCollectionList posts={posts} renderActions={renderActions} className={listClassName} />
    );
  }

  return <div className={styles.slot} />;
};
