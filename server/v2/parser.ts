import { NextApiRequest } from "next";
import { getStringArray } from "~utils/primitive";

export interface ParsedRequest {
  fileType: "png" | "jpeg";
  text: string;
  theme: "light" | "dark";
  icons: string[];
  colors: string[];
}

export const parseRequest = (req: NextApiRequest) => {
  const { query } = req;
  const { slug, theme, icons, colors } = query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");

  const parts = slug.split(".");
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

  const parsedReq: ParsedRequest = {
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    icons: getStringArray(icons),
    colors: getStringArray(colors),
  };
  return parsedReq;
};
