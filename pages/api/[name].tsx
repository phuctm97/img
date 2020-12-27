import { NextApiRequest, NextApiResponse } from "next";
import { parseRequest } from "~server/parser";
import { getHtml } from "~server/template";
import { getScreenshot } from "~server/chromium";

const isChromeLocal = process.env.CHROME_REMOTE !== "1";
const isHTMLDebug = process.env.HTML_DEBUG === "1";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parsedReq = parseRequest(req);
    const html = getHtml(parsedReq);
    if (isHTMLDebug) {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    const { fileType } = parsedReq;
    const screenshot = await getScreenshot(html, fileType, isChromeLocal);
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${fileType}`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.end(screenshot);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
    console.error(err);
  }
};
