export const isChromeRemote = process.env.CHROME_REMOTE === "1";

export const isChromeLocal = !isChromeRemote;

export const isHTMLDebug = process.env.HTML_DEBUG === "1";
