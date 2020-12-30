export const toStringArray = (
  stringOrArray: string[] | string | undefined
): string[] => {
  if (typeof stringOrArray === "undefined") return [];
  if (Array.isArray(stringOrArray)) return stringOrArray;
  return [stringOrArray];
};

export const splitNameAndExtension = (str: string): [string, string] => {
  const parts = str.split(".");
  let ext = "";
  let text = "";
  if (parts.length === 0) {
    text = "";
  } else if (parts.length === 1) {
    text = parts[0];
  } else {
    ext = parts.pop() || "";
    text = parts.join(".");
  }
  return [text, ext];
};
