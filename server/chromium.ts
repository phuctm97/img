import puppeteer, { Page } from "puppeteer-core";
import { getOptions } from "./options";
import { FileType } from "./types";

let prebuiltPage: Page | null;

async function getPage(isDev: boolean) {
  if (prebuiltPage) return prebuiltPage;

  const options = await getOptions(isDev);
  const browser = await puppeteer.launch(options);
  prebuiltPage = await browser.newPage();
  return prebuiltPage;
}

export async function getScreenshot(
  html: string,
  type: FileType,
  isDev: boolean
) {
  const page = await getPage(isDev);
  await page.setViewport({ width: 2048, height: 1170 });
  await page.setContent(html);
  const file = await page.screenshot({ type });
  return file;
}
