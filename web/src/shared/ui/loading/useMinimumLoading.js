import { useEffect, useRef, useState } from "react";

export const useMinimumLoading = (isLoading, error) => {
  const [visible, setVisible] = useState(isLoading);
  const startedAt = useRef(isLoading ? Date.now() : null);

  useEffect(() => {
    if (isLoading) {
      if (startedAt.current === null) startedAt.current = Date.now();
      setVisible(true);

      return;
    }

    if (error) {
      startedAt.current = null;
      setVisible(false);

      return;
    }

    if (startedAt.current === null) return;
    const remaining = Math.max(300, 500 - (Date.now() - startedAt.current));
    const timer = setTimeout(() => {
      startedAt.current = null;
      setVisible(false);
    }, remaining);

    return () => clearTimeout(timer);
  }, [isLoading, error]);

  return { visible: isLoading || (!error && visible), completing: !isLoading && !error && visible };
};
