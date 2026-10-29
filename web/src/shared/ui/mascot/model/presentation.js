import { MASCOTS } from "./catalog.js";

const contexts = {
  browse: {
    character: "scout",
    hint: "Let's find something worth keeping. Search a topic, or peek into a category.",
  },
  writing: {
    character: "clip",
    hint: "Pull up a chair. Tell us what you expected and what happened instead.",
  },
  account: {
    character: "wisp",
    hint: "One little step at a time. Your details are safe to review before you save.",
  },
  system: {
    character: "byte",
    hint: "I'm here while we get things settled. The next step is right beside you.",
  },
  manage: {
    character: "byte",
    hint: "A tidy community starts with thoughtful changes. Take a moment before you save.",
  },
};

export const getMascotPresentation = (context = "browse") => {
  const entry = contexts[context] ?? contexts.browse;

  return { ...MASCOTS[entry.character], hint: entry.hint };
};
