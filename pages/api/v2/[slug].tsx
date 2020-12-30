import { NextApiRequest, NextApiResponse } from "next";
import { renderScreenshot, withErrorHandler } from "~server/api";
import { getScreenshot } from "~server/chromium";
import { isHTMLDebug } from "~utils/env";
import { parseRequest } from "~server/v2/parser";
import { getHTML } from "~server/v2/template";

export default (req: NextApiRequest, res: NextApiResponse) =>
  withErrorHandler(res)(async () => {
    const props = parseRequest(req);
    const html = getHTML(props);
    if (isHTMLDebug) {
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      return;
    }

    const { fileType } = props;
    const screenshot = await getScreenshot(html, fileType, {
      width: props.width,
      height: props.height,
    });
    renderScreenshot(res, screenshot, fileType);
  });
