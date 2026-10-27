import { Navigate, useParams } from "react-router";
import { useGetCommentQuery } from "../../../entities/comment/api/commentApi.js";
import { getErrorMessage } from "../../../shared/api/index.js";

export const CommentPermalinkPage = () => {
  const { commentId } = useParams();
  const valid =
    Number.isSafeInteger(Number(commentId)) && Number(commentId) > 0;
  const query = useGetCommentQuery(commentId, { skip: !valid });
  if (!valid) {
    return <p role="alert">That comment address is not valid.</p>;
  }
  if (query.isLoading) {
    return <p role="status">Finding that reply…</p>;
  }
  if (query.error || !query.data) {
    return (
      <p role="alert">
        {getErrorMessage(query.error, "This comment could not be found.")}
      </p>
    );
  }
  return (
    <Navigate
      replace
      to={`/posts/${query.data.post_id}#comment-${query.data.id}`}
    />
  );
};
