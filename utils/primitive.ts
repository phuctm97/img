export const getStringArray = (
  stringOrArray: string[] | string | undefined
): string[] => {
  if (typeof stringOrArray === "undefined") return [];
  if (Array.isArray(stringOrArray)) return stringOrArray;
  return [stringOrArray];
};
