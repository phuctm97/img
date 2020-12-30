import puppeteer, { Page } from "puppeteer-core";
import ChromeAWS from "chrome-aws-lambda";
import { isChromeLocal } from "~utils/env";

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

/**
 * Renders an HTML and takes screenshot.
 *
 * @param html HTML to render
 * @param type Output image type (JPEG or PNG)
 * @param opts Browser options
 */
export const getScreenshot = async (
  html: string,
  type: NonNullable<puppeteer.ScreenshotOptions["type"]>,
  { isLocal = isChromeLocal, width = 1200, height = 630 }
) => {
  const page = await getPage(isLocal);
  await page.setViewport({ width, height });
  await page.setContent(html);
  return page.screenshot({ type });
};
