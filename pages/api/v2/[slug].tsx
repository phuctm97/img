import { NextApiRequest, NextApiResponse } from "next";
import { getScreenshot } from "~server/chromium";
import { parseRequest } from "~server/v2/parser";
import { getHtml } from "~server/v2/template";
import { dayInSecs } from "~utils/time";
import { isHTMLDebug } from "~utils/env";

const cacheAge = 7 * dayInSecs;

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
    const screenshot = await getScreenshot(html, fileType, {
      width: parsedReq.width,
      height: parsedReq.height,
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${fileType}`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=${cacheAge}, max-age=${cacheAge}`
    );
    res.end(screenshot);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
    console.error(err);
  }
};
