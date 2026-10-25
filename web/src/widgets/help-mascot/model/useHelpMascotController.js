import { useState } from "react";
import { HELP_MASCOT_TIPS, TIP_POSES } from "./constants.js";

export const useHelpMascotController = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [pose, setPose] = useState("idle");

  const showAnotherTip = () => {
    const nextIndex = (tipIndex + 1) % HELP_MASCOT_TIPS.length;
    setTipIndex(nextIndex);
    setPose(TIP_POSES[nextIndex]);
  };

  const restore = () => {
    setPose("welcome");
    setIsVisible(true);
  };

  return {
    isVisible,
    pose,
    tip: HELP_MASCOT_TIPS[tipIndex],
    showAnotherTip,
    hide: () => setIsVisible(false),
    restore,
  };
};
