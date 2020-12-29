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

const getCss = (theme: string, fontSize: string, baseSize = "16px") => {
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
      src: url(data:font/woff2;charset=utf-8;base64,${mono}) format("woff2");
    }
    html {
      font-size: ${baseSize};
    }
    html, body {
      margin: 0;
      padding: 0;
    }
    body {
      background: ${background};
      background-image: radial-gradient(circle at 1.6rem 1.6rem, ${radial} 2%, transparent 0%), radial-gradient(circle at 4.7rem 4.7rem, ${radial} 2%, transparent 0%);
      background-size: 6.25rem 6.25rem;
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
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
      margin: 0 4.7rem;
    }
    .plus {
      color: #bbb;
      font-family: Times New Roman, Verdana;
      font-size: 6.25rem;
    }
    .spacer {
      margin: 6.25rem;
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
    }
    footer p {
      font-size: 2rem;
    }
    footer p strong {
      color: #2563eb;
    }
    footer p svg {
      height: 1.7em;
      margin-bottom: -0.3em;
    }
    #devto {
      height: 2.2em;
      margin-bottom: -0.65em;
    }
    `;
};

const getImage = (src: string, width = "auto", height = "225") => `<img
  class="logo"
  alt="Generated Image"
  src="${sanitizeHtml(src)}"
  width="${sanitizeHtml(width)}"
  height="${sanitizeHtml(height)}"
/>`;

const getPlusSign = (i: number) => (i === 0 ? "" : '<div class="plus">+</div>');

export const getHtml = (req: ParsedRequest, isDebug = false) => {
  const { text, theme, md, fontSize, images, widths, heights } = req;
  return `<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize, isDebug ? "16px" : "12px")}
  </style>
  <body>
    <div class="spacer">
      <div class="logo-wrapper">
        ${images
          .map(
            (img, i) => getPlusSign(i) + getImage(img, widths[i], heights[i])
          )
          .join("")}
      </div>
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      <footer>
        <p>
          Available at ${emojify("🔗")} <strong>phuctm97.com</strong>
          and <strong><span style="font-size:1.25em">@</span>phuctm97</strong> on
          <svg role="img" fill="#1da1f2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          + <svg role="img" fill="#181717" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          + <svg id="devto" role="img" fill="#0a0a0a" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>DEV.to</title><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/></svg>
          + <svg fill="none" viewBox="0 0 337 337"><rect x="113" y="113" width="111" height="111" rx="55.5" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M23.155 112.598c-30.873 30.874-30.873 80.93 0 111.804l89.443 89.443c30.874 30.873 80.93 30.873 111.804 0l89.443-89.443c30.873-30.874 30.873-80.93 0-111.804l-89.443-89.443c-30.874-30.873-80.93-30.873-111.804 0l-89.443 89.443zm184.476 95.033c21.612-21.611 21.612-56.651 0-78.262-21.611-21.612-56.651-21.612-78.262 0-21.612 21.611-21.612 56.651 0 78.262 21.611 21.612 56.651 21.612 78.262 0z" fill="#2962FF"/></svg>
        </p>
      </footer>
    </div>
  </body>
</html>`;
};
