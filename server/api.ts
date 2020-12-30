import { NextApiResponse } from "next";
import { dayInSecs } from "~utils/time";

const cacheAge = 7 * dayInSecs;

/**
 * Handles uncaught API errors.
 *
 * @param res Response object to render error page
 */
export const withErrorHandler = (res: NextApiResponse) => (
  fn: () => Promise<void>
) =>
  fn().catch((err) => {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem.</p>");
    console.error(err);
  });

/**
 * Renders a screenshot to client (with preconfigured cache).
 *
 * @param res Response object to render result page
 * @param screenshot Screenshot stream
 * @param fileType Screenshot's MIME type
 */
export const renderScreenshot = (
  res: NextApiResponse,
  screenshot: Buffer,
  fileType: string
) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", `image/${fileType}`);
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=${cacheAge}, max-age=${cacheAge}`
  );
  res.end(screenshot);
};
