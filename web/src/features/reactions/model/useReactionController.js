import { useState } from "react";
import { getErrorMessage } from "../../../shared/api/index.js";
import { useCreateReactionMutation, useDeleteReactionMutation } from "../api/reactionsApi.js";

export const useReactionController = ({
  target,
  targetId,
  postId,
  viewerReaction,
  currentUser,
  canReact,
}) => {
  const [createReaction, createState] = useCreateReactionMutation();
  const [deleteReaction, deleteState] = useDeleteReactionMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const isBusy = createState.isLoading || deleteState.isLoading;
  const isAvailable = Boolean(currentUser && canReact);
  const availabilityMessage = !currentUser
    ? "Login to react"
    : !canReact
      ? "Reactions are closed on inactive content"
      : undefined;

  const changeReaction = async (type) => {
    if (!isAvailable || isBusy) {
      return;
    }

    setErrorMessage(null);

    try {
      if (viewerReaction === type) {
        await deleteReaction({ target, targetId, postId }).unwrap();
      } else {
        if (viewerReaction) {
          await deleteReaction({ target, targetId, postId, skipRefresh: true }).unwrap();
        }

        await createReaction({ target, targetId, postId, type }).unwrap();
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Your reaction could not be saved."));
    }
  };

  return { isBusy, isAvailable, availabilityMessage, errorMessage, changeReaction };
};
