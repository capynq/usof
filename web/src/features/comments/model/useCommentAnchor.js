import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export const useCommentAnchor = (comments) => {
  const { hash } = useLocation();
  const handledHash = useRef("");
  useEffect(() => {
    if (!hash) {
      handledHash.current = "";
      return;
    }
    if (!hash.startsWith("#comment-") || handledHash.current === hash) {
      return;
    }
    const element = document.getElementById(hash.slice(1));
    if (element) {
      handledHash.current = hash;
      element.scrollIntoView({ block: "center" });
      element.focus({ preventScroll: true });
    }
  }, [hash, comments]);
};
