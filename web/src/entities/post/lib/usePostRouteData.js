import { useParams } from "react-router";
import { useGetPostQuery } from "../api/postApi.js";

export const usePostRouteData = () => {
  const { postId: rawPostId } = useParams();
  const postId = Number(rawPostId);
  const isValidPostId = Number.isInteger(postId) && postId > 0;
  const query = useGetPostQuery(postId, { skip: !isValidPostId });

  return { postId, isValidPostId, ...query };
};
