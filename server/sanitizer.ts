const sanitizedTokens: { [key: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
};

/**
 * Returns an HTML from the original source that has invalid HTML tokens replaced with valid ones.
 *
 * @param html Input HTML
 */
export const sanitizeHTML = (html: string | Buffer) =>
  String(html).replace(/[&<>"'\/]/g, (key) => sanitizedTokens[key]);
