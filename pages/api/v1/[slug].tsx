import { NextApiRequest, NextApiResponse } from "next";
import { renderScreenshot, withErrorHandler } from "~server/api";
import { getScreenshot } from "~server/chromium";
import { isHTMLDebug } from "~utils/env";
import { parseRequest } from "~server/v1/parser";
import { getHTML } from "~server/v1/template";

export default (req: NextApiRequest, res: NextApiResponse) =>
  withErrorHandler(res)(async () => {
    const props = parseRequest(req);
    const html = getHTML(props, isHTMLDebug);
    if (isHTMLDebug) {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    const { fileType } = props;
    const screenshot = await getScreenshot(html, fileType, {});
    renderScreenshot(res, screenshot, fileType);
  });
