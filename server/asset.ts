import path from "path";
import { readFileSync } from "fs";

const fontsDir = path.join(process.cwd(), "fonts");
const imagesDir = path.join(process.cwd(), "images");

/**
 * Reads a font's content in base64.
 *
 * @param name Font filename
 */
export const readFont = (name: string) =>
  readFileSync(path.join(fontsDir, name), "base64");

/**
 * Reads an image's content in base64.
 *
 * @param name Image filename
 */
export const readImage = (name: string) =>
  readFileSync(path.join(imagesDir, name), "base64");
