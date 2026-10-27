import homeTips from "./homeTips.json";

export const HOME_TIPS = homeTips;

export const pickHomeTip = (previousCharacterId, random = Math.random) => {
  const characters = Object.keys(HOME_TIPS).filter(
    (id) => id !== previousCharacterId,
  );
  const characterId = characters[Math.floor(random() * characters.length)];
  return {
    characterId,
    tipIndex: Math.floor(random() * HOME_TIPS[characterId].length),
  };
};
