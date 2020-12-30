import { NextApiRequest } from "next";
import { splitNameAndExtension, toStringArray } from "~utils/primitive";

export interface ParsedRequest {
  fileType: "png" | "jpeg";
  fontSize: number;
  width: number;
  height: number;
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
  const { slug, theme, target, icons, colors } = req.query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");
  if (Array.isArray(target)) throw new Error("Expected a single target.");

  const [text, ext] = splitNameAndExtension(slug);
  const preset = presets[target] || presets.og;

  const parsedReq: ParsedRequest = {
    ...preset,
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    icons: toStringArray(icons),
    colors: toStringArray(colors),
  };
  return parsedReq;
};
