import actionStyles from "./ActionButton.module.css";

export const getActionButtonClass = ({
  iconOnly = false,
  labeled = false,
  extraClassName = "",
} = {}) => {
  const parts = [actionStyles.button];

  if (iconOnly) {
    parts.push(actionStyles.iconOnly);
  }

  if (labeled) {
    parts.push(actionStyles.labeled);
  }

  parts.push(extraClassName);

  return parts.filter(Boolean).join(" ");
};
