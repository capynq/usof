export const stripMarkdown = (text = "") =>
  text
    .replace(/^[ \t]*```.*$/gm, "")
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\n[ \t]*\n+/g, "\n")
    .trim();
