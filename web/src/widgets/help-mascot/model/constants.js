import explainingSprite from "../../../shared/assets/paperclip-explaining.svg";
import happySprite from "../../../shared/assets/paperclip-happy.svg";
import idleSprite from "../../../shared/assets/paperclip-idle.svg";
import thinkingSprite from "../../../shared/assets/paperclip-thinking.svg";
import welcomeSprite from "../../../shared/assets/paperclip-welcome.svg";

export const HELP_MASCOT_STATES = {
  idle: {
    sprite: idleSprite,
    heading: "Clip has a tip"
  },
  thinking: {
    sprite: thinkingSprite,
    heading: "Let me think"
  },
  explaining: {
    sprite: explainingSprite,
    heading: "Here's a pointer"
  },
  happy: {
    sprite: happySprite,
    heading: "You've got this"
  },
  welcome: {
    sprite: welcomeSprite,
    heading: "Nice to see you"
  }
};

export const HELP_MASCOT_TIPS = [
  "Stuck on a bug? Share what you expected and what happened instead.",
  "A small code example is often easier for others to follow.",
  "Tell the community what you already tried. It helps people suggest the next step."
];

export const TIP_POSES = ["happy", "thinking", "explaining"];
