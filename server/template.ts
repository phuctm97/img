import path from "path";
import { readFileSync } from "fs";
import marked from "marked";
import twemoji from "twemoji";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";

const emojify = (text: string) =>
  twemoji.parse(text, { folder: "svg", ext: ".svg" });

const fontsDir = path.join(process.cwd(), "fonts");
const readFont = (name: string) =>
  readFileSync(path.join(fontsDir, name)).toString("base64");

const rglr = readFont("Inter-Regular.woff2");
const bold = readFont("Inter-Bold.woff2");
const mono = readFont("Vera-Mono.woff2");

const getCss = (theme: string, fontSize: string) => {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `
    @font-face {
      font-family: 'Inter';
      font-style:  normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style:  normal;
      font-weight: bold;
      src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    @font-face {
      font-family: 'Vera';
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }
    body {
      background: ${background};
      background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
      background-size: 100px 100px;
      height: 100vh;
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
    code {
      color: #D400FF;
      font-family: 'Vera';
      white-space: pre-wrap;
      letter-spacing: -5px;
    }
    code:before, code:after {
      content: '\`';
    }
    .logo-wrapper {
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      justify-items: center;
    }
    .logo {
      margin: 0 75px;
    }
    .plus {
      color: #BBB;
      font-family: Times New Roman, Verdana;
      font-size: 100px;
    }
    .spacer {
      margin: 150px;
    }
    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }
    .heading {
      font-family: 'Inter', sans-serif;
      font-size: ${sanitizeHtml(fontSize)};
      font-style: normal;
      color: ${foreground};
      line-height: 1.8;
    }`;
};

const getImage = (src: string, width = "auto", height = "225") => `<img
  class="logo"
  alt="Generated Image"
  src="${sanitizeHtml(src)}"
  width="${sanitizeHtml(width)}"
  height="${sanitizeHtml(height)}"
/>`;

const getPlusSign = (i: number) => (i === 0 ? "" : '<div class="plus">+</div>');

export const getHtml = (req: ParsedRequest) => {
  const { text, theme, md, fontSize, images, widths, heights } = req;
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <body>
    <div>
      <div class="spacer">
      <div class="logo-wrapper">
        ${images
          .map(
            (img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i])
          )
          .join("")}
      </div>
      <div class="spacer">
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
    </div>
  </body>
</html>`;
};
