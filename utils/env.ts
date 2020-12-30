/**
 * Is accessing Chrome remotely?
 */
export const isChromeRemote = process.env.CHROME_REMOTE === "1";

/**
 * Is accessing Chrome locally?
 */
export const isChromeLocal = !isChromeRemote;

/**
 * Is debugging HTML output?
 */
export const isHTMLDebug = process.env.HTML_DEBUG === "1";
