import { LoadingIndicator, useMinimumLoading } from "../../../shared/ui/loading/index.js";
import { StateCompanion } from "../../../shared/ui/mascot/StateCompanion.jsx";
import { PostPreview } from "./PostPreview.jsx";
import {
  API_ERROR_MESSAGES,
  getErrorMessage,
} from "../../../shared/api/index.js";

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
    return <LoadingIndicator completing={completing}>{loadingMessage}</LoadingIndicator>;
  }

  if (error) {
    return (
      <StateCompanion kind="error">
        <p className={errorClassName} role="alert">
          {getErrorMessage(error, errorMessage)}
        </p>
      </StateCompanion>
    );
  }

  if (posts?.length === 0) {
    return (
      <div>
        <StateCompanion kind="empty">
          <p className={stateClassName}>{emptyMessage}</p>
        </StateCompanion>
      </div>
    );
  }

  if (!posts?.length) {
    return null;
  }

  return (
    <div className={listClassName}>
      {posts.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          actions={renderActions?.(post)}
        />
      ))}
    </div>
  );
};
