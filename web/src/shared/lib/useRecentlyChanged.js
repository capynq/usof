import { useEffect, useRef, useState } from "react";
import { REFRESH_HIGHLIGHT_MS } from "../config.js";

const EMPTY_SIGNATURE = JSON.stringify(null);

export const useRecentlyChanged = (value) => {
  const signature = JSON.stringify(value);
  const previousSignature = useRef(signature);
  const [recentlyChanged, setRecentlyChanged] = useState(false);

  useEffect(() => {
    const previous = previousSignature.current;
    previousSignature.current = signature;

    if (previous === signature) return;

    if (previous === EMPTY_SIGNATURE) {
      setRecentlyChanged(false);

      return;
    }

    setRecentlyChanged(true);
    const timer = setTimeout(() => setRecentlyChanged(false), REFRESH_HIGHLIGHT_MS);

    return () => clearTimeout(timer);
  }, [signature]);

  return recentlyChanged;
};
