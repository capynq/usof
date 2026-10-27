import clipIdle from "../../../assets/paperclip-idle.svg";
import clipWelcome from "../../../assets/paperclip-welcome.svg";
import clipThinking from "../../../assets/paperclip-thinking.svg";
import clipExplaining from "../../../assets/paperclip-explaining.svg";
import clipHappy from "../../../assets/paperclip-happy.svg";
import scoutIdle from "../../../assets/mascots/scout-idle.svg";
import scoutWelcome from "../../../assets/mascots/scout-welcome.svg";
import scoutThinking from "../../../assets/mascots/scout-thinking.svg";
import scoutExplaining from "../../../assets/mascots/scout-explaining.svg";
import scoutHappy from "../../../assets/mascots/scout-happy.svg";
import wispIdle from "../../../assets/mascots/wisp-idle.svg";
import wispWelcome from "../../../assets/mascots/wisp-welcome.svg";
import wispThinking from "../../../assets/mascots/wisp-thinking.svg";
import wispExplaining from "../../../assets/mascots/wisp-explaining.svg";
import wispHappy from "../../../assets/mascots/wisp-happy.svg";
import byteIdle from "../../../assets/mascots/byte-idle.svg";
import byteWelcome from "../../../assets/mascots/byte-welcome.svg";
import byteThinking from "../../../assets/mascots/byte-thinking.svg";
import byteExplaining from "../../../assets/mascots/byte-explaining.svg";
import byteHappy from "../../../assets/mascots/byte-happy.svg";

export const MASCOTS = {
  clip: {
    id: "clip",
    name: "Clip",
    role: "Your writing buddy",
    poses: {
      idle: clipIdle,
      welcome: clipWelcome,
      thinking: clipThinking,
      explaining: clipExplaining,
      happy: clipHappy,
    },
  },
  scout: {
    id: "scout",
    name: "Scout",
    role: "Your curious little explorer",
    poses: {
      idle: scoutIdle,
      welcome: scoutWelcome,
      thinking: scoutThinking,
      explaining: scoutExplaining,
      happy: scoutHappy,
    },
  },
  wisp: {
    id: "wisp",
    name: "Wisp",
    role: "A little guidance, one step at a time",
    poses: {
      idle: wispIdle,
      welcome: wispWelcome,
      thinking: wispThinking,
      explaining: wispExplaining,
      happy: wispHappy,
    },
  },
  byte: {
    id: "byte",
    name: "Byte",
    role: "Keeping the community humming",
    poses: {
      idle: byteIdle,
      welcome: byteWelcome,
      thinking: byteThinking,
      explaining: byteExplaining,
      happy: byteHappy,
    },
  },
};
