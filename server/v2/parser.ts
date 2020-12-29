import { NextApiRequest } from "next";
import { getStringArray } from "~utils/primitive";

export interface ParsedRequest {
  fileType: "png" | "jpeg";
  width: number;
  height: number;
  fontSize: number;
  marginTop: number;
  marginBottom: number;
  text: string;
  theme: "light" | "dark";
  icons: string[];
  colors: string[];
}

type Preset = {
  width: number;
  height: number;
  fontSize: number;
  marginTop: number;
  marginBottom: number;
};

const presets: { [index: string]: Preset } = {
  og: { width: 1200, height: 630, fontSize: 10, marginTop: 2, marginBottom: 2 },
  devto: {
    width: 1000,
    height: 420,
    fontSize: 8,
    marginTop: 0.8,
    marginBottom: 0.8,
  },
};

export const parseRequest = (req: NextApiRequest) => {
  const { query } = req;
  const { slug, theme, target, icons, colors } = query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");
  if (Array.isArray(target)) throw new Error("Expected a single target.");

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

  const preset = presets[target || ""] || presets.og;
  const parsedReq: ParsedRequest = {
    ...preset,
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    icons: getStringArray(icons),
    colors: getStringArray(colors),
  };
  return parsedReq;
};
