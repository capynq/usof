import { useState } from "react";
import { getErrorMessage } from "../api/index.js";

export const useConfirmMutation = ({
  mutate,
  onSuccess,
  fallbackMessage,
  closeOnError = false,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const run = async (...args) => {
    setErrorMessage(null);

    try {
      await mutate(...args).unwrap();
      setIsConfirming(false);
      await onSuccess?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, fallbackMessage));

      if (closeOnError) {
        setIsConfirming(false);
      }
    }
  };

  return { isConfirming, setIsConfirming, errorMessage, setErrorMessage, run };
};
