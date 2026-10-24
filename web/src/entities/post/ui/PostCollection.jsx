import { PostPreview } from "./PostPreview.jsx";
import { API_ERROR_MESSAGES, getErrorMessage } from "../../../shared/api/index.js";

export const PostCollection = ({
  posts,
  error,
  isLoading,
  loadingMessage,
  emptyMessage,
  errorMessage = API_ERROR_MESSAGES.questionsCouldNotLoad,
  listClassName,
  stateClassName,
  errorClassName,
}) => {
  if (isLoading) {
    return <p className={stateClassName}>{loadingMessage}</p>;
  }

  if (error) {
    return <p className={errorClassName} role="alert">{getErrorMessage(error, errorMessage)}</p>;
  }

  if (posts?.length === 0) {
    return <p className={stateClassName}>{emptyMessage}</p>;
  }

  if (!posts?.length) {
    return null;
  }

  return (
    <div className={listClassName}>
      {posts.map((post) => <PostPreview key={post.id} post={post} />)}
    </div>
  );
};
