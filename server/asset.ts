import path from "path";
import { readFileSync } from "fs";

const fontsDir = path.join(process.cwd(), "fonts");

/**
 * Reads a font's content in base64.
 *
 * @param name Font filename
 */
export const readFont = (name: string) =>
  readFileSync(path.join(fontsDir, name), "base64");
