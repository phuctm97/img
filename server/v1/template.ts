import marked from "marked";
import twemoji from "twemoji";
import { readFont } from "~server/asset";
import { sanitizeHTML } from "~server/sanitizer";
import { RenderProps } from "./parser";

const emojify = (text: string) =>
  twemoji.parse(text, { folder: "svg", ext: ".svg" });

const rglr = readFont("Inter-Regular.woff2");
const bold = readFont("Inter-Bold.woff2");
const mono = readFont("Vera-Mono.woff2");

const getCSS = (theme: string, textFontSize: string, htmlFontSize: string) => {
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
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: bold;
      src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }
    @font-face {
      font-family: 'Vera';
      font-style: normal;
      font-weight: normal;
      src: url(data:font/woff2;charset=utf-8;base64,${mono}) format('woff2');
    }
    html {
      font-size: ${htmlFontSize};
    }
    body {
      font-family: 'Inter', sans-serif;
      background: ${background};
      background-image: radial-gradient(circle at 1.5rem 1.5rem, ${radial} 2%, transparent 0%), radial-gradient(circle at 5rem 5rem, ${radial} 2%, transparent 0%);
      background-size: 6.5rem 6.5rem;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;
    }
    code {
      color: #d400ff;
      font-family: 'Vera';
      white-space: pre-wrap;
      letter-spacing: -0.32rem;
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
      margin: 0 4.5rem;
    }
    .plus {
      color: #bbb;
      font-family: 'Times New Roman', Verdana;
      font-size: 6.25rem;
    }
    .emoji {
      height: 1em;
      width: 1em;
      margin: 0 .05em 0 .1em;
      vertical-align: -0.1em;
    }
    .heading {
      font-family: 'Inter', sans-serif;
      font-size: ${sanitizeHTML(textFontSize)};
      font-style: normal;
      color: ${foreground};
      line-height: 1.8;
    }`;
};

const getImg = (src: string, width = "auto", height = "18rem") => `
<img
  class="logo"
  alt="Generated Image"
  src="${sanitizeHTML(src)}"
  style="width:${sanitizeHTML(width)};height:${sanitizeHTML(height)};"
/>`;

const getPlusSign = (i: number) => (i === 0 ? "" : '<div class="plus">+</div>');

/**
 * Renders output HTML.
 *
 * @param props Rendering props
 * @param isDebug Is debugging HTML?
 */
export const getHTML = (props: RenderProps, isDebug = false) => {
  const { text, theme, md, fontSize, images, widths, heights } = props;
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCSS(theme, fontSize, isDebug ? "16px" : "10px")}
  </style>
  <body>
    <div class="logo-wrapper">
      ${images
        .map((img, i) => getPlusSign(i) + getImg(img, widths[i], heights[i]))
        .join("")}
    </div>
    <div class="heading">${emojify(
      md ? marked(text) : sanitizeHTML(text)
    )}</div>
  </body>
</html>`;
};
