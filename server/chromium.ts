import puppeteer, { Page } from "puppeteer-core";
import ChromeAWS from "chrome-aws-lambda";
import { isChromeLocal } from "~utils/env";
import { FileType } from "./types";

const localExePath =
  (process.platform === "win32" &&
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe") ||
  (process.platform === "linux" && "/usr/bin/google-chrome") ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const getOptions = async (isLocal = isChromeLocal) =>
  isLocal
    ? {
        args: [],
        executablePath: localExePath,
        headless: true,
      }
    : {
        args: ChromeAWS.args,
        executablePath: await ChromeAWS.executablePath,
        headless: ChromeAWS.headless,
      };

let cachedPage: Page | null;

const getPage = async (isLocal = isChromeLocal) => {
  if (cachedPage) return cachedPage;

  const options = await getOptions(isLocal);
  const browser = await puppeteer.launch(options);

  cachedPage = await browser.newPage();
  return cachedPage;
};

export const getScreenshot = async (
  html: string,
  type: FileType,
  isLocal = isChromeLocal
) => {
  const page = await getPage(isLocal);
  await page.setViewport({ width: 1200, height: 630 }); // OG recommended image size
  await page.setContent(html);
  return page.screenshot({ type });
};
