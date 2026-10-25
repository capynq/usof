import { useState } from "react";
import { useCreateCommentMutation } from "../../../entities/comment/index.js";
import { getErrorMessage } from "../../../shared/api/index.js";

export const useCommentForm = ({ postId, parentId, onCreated }) => {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const submit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await createComment({
        postId,
        content: content.trim(),
        ...(parentId === null ? {} : { parent_id: parentId }),
      }).unwrap();
      setContent("");
      onCreated?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Your reply could not be posted."));
    }
  };

  return {
    content,
    setContent,
    errorMessage,
    isLoading,
    submit,
  };
};
