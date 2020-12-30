import { NextApiRequest } from "next";
import { splitNameAndExtension, toStringArray } from "~utils/primitive";

export type RenderProps = {
  fileType: "png" | "jpeg";
  text: string;
  theme: "light" | "dark";
  md: boolean;
  fontSize: string;
  images: string[];
  widths: string[];
  heights: string[];
};

/**
 * Parses API request into rendering props.
 *
 * @param req Incoming request
 */
export const parseRequest = (req: NextApiRequest) => {
  const { slug, fontSize, images, widths, heights, theme, md } = req.query;

  if (Array.isArray(slug)) throw new Error("Expected a single slug.");
  if (Array.isArray(fontSize)) throw new Error("Expected a single fontSize.");
  if (Array.isArray(theme)) throw new Error("Expected a single theme.");

  const [text, ext] = splitNameAndExtension(slug);
  const props: RenderProps = {
    fileType: ext === "jpeg" || ext === "jpg" ? "jpeg" : "png",
    text: decodeURIComponent(text),
    theme: theme === "dark" ? "dark" : "light",
    md: md === "1" || md === "true",
    fontSize: fontSize || "6.5rem",
    images: toStringArray(images),
    widths: toStringArray(widths),
    heights: toStringArray(heights),
  };

  return props;
};
