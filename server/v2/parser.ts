import { NextApiRequest } from "next";
import { splitNameAndExtension, toStringArray } from "~utils/primitive";

type Preset = {
  fontSize: number;
  width: number;
  height: number;
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

export type RenderProps = Preset & {
  fileType: "png" | "jpeg";
  text: string;
  theme: "light" | "dark";
  icons: string[];
  colors: string[];
};

/**
 * Parses API request into rendering props.
 *
 * @param req Incoming request
 */
export const parseRequest = (req: NextApiRequest) => {
  const { slug, theme, target, icons, colors } = req.query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");
  if (Array.isArray(target)) throw new Error("Expected a single target.");

  const [text, ext] = splitNameAndExtension(slug);
  const preset = presets[target] || presets.og;

  const props: RenderProps = {
    ...preset,
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    icons: toStringArray(icons),
    colors: toStringArray(colors),
  };
  return props;
};
