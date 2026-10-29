import { useState } from "react";
import { HOME_TIPS, pickHomeTip } from "./homeTips.js";

export const useHomeTipController = () => {
  const [selection, setSelection] = useState(() => pickHomeTip());

  const nextTip = () => {
    setSelection((previous) => pickHomeTip(previous.characterId));
  };

  return {
    characterId: selection.characterId,
    tip: HOME_TIPS[selection.characterId][selection.tipIndex],
    nextTip,
  };
};
